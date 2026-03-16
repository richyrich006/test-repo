"""
executor.py - Places a mirrored trade on Polymarket.

Given a raw trade dict from the monitor, this module:
  1. Parses the trade into the fields we need (market, outcome, side, size, price)
  2. Scales the size by COPY_FRACTION and clamps it to configured limits
  3. Uses py-clob-client to submit a market or limit order on your behalf
"""

import logging
from decimal import Decimal, ROUND_DOWN, ROUND_UP
from math import gcd as _gcd

from py_clob_client.client import ClobClient
from py_clob_client.clob_types import (
    ApiCreds,
    OrderArgs,
    OrderType,
)

BUY = "BUY"
SELL = "SELL"
from py_clob_client.exceptions import PolyApiException

import config

logger = logging.getLogger(__name__)


def _build_client() -> ClobClient:
    """Create an authenticated ClobClient using our private key."""
    client = ClobClient(
        host=config.CLOB_API_URL,
        key=config.PRIVATE_KEY,
        chain_id=config.CHAIN_ID,
        funder=config.POLY_PROXY_ADDRESS or None,
        signature_type=2,  # Gnosis Safe / Polymarket proxy wallet
    )
    creds: ApiCreds = client.create_or_derive_api_creds()
    client.set_api_creds(creds)
    return client


# Build the client once at module load
_client: ClobClient | None = None


def get_client() -> ClobClient:
    global _client
    if _client is None:
        _client = _build_client()
    return _client


def _parse_side(trade: dict) -> str:
    """
    Return BUY or SELL based on the trade record.
    Polymarket activity records use 'BUY' / 'SELL' or 'buy' / 'sell'.
    """
    side = str(trade.get("side", "BUY")).upper()
    return BUY if side == "BUY" else SELL


def _parse_trade(trade: dict) -> dict | None:
    """
    Extract the fields needed to place an order.
    Returns a dict with keys: token_id, side, price, size_usdc
    or None if the trade can't be parsed.
    """
    # token_id identifies the specific outcome token (e.g. "Yes" for a market)
    token_id = (
        trade.get("asset")
        or trade.get("tokenId")
        or trade.get("outcomeTokenId")
    )
    if not token_id:
        logger.warning("Trade missing token_id, skipping: %s", trade)
        return None

    try:
        price = float(trade.get("price") or trade.get("outcomePrice") or 0)
        size_usdc = float(trade.get("usdcSize") or trade.get("amount") or 0)
    except (TypeError, ValueError) as exc:
        logger.warning("Could not parse trade numbers: %s — %s", exc, trade)
        return None

    if price <= 0 or size_usdc <= 0:
        logger.warning("Trade has zero price or size, skipping.")
        return None

    return {
        "token_id": str(token_id),
        "side": _parse_side(trade),
        "price": price,
        "size_usdc": size_usdc,
    }


def _scale_size(size_usdc: float) -> float | None:
    """
    Apply COPY_FRACTION, then clamp between MIN and MAX.
    Returns None if the result is below the minimum (trade not worth copying).
    """
    scaled = size_usdc * config.COPY_FRACTION
    if scaled < config.MIN_TRADE_SIZE_USDC:
        logger.info(
            "Scaled size $%.2f is below minimum $%.2f — skipping.",
            scaled,
            config.MIN_TRADE_SIZE_USDC,
        )
        return None
    clamped = min(scaled, config.MAX_TRADE_SIZE_USDC)
    if clamped < scaled:
        logger.info(
            "Clamped trade size from $%.2f to MAX $%.2f.",
            scaled,
            config.MAX_TRADE_SIZE_USDC,
        )
    return clamped


def copy_trade(trade: dict) -> bool:
    """
    Mirror a single trade from the target trader.

    Returns True if the order was submitted successfully, False otherwise.
    """
    parsed = _parse_trade(trade)
    if parsed is None:
        return False

    final_size = _scale_size(parsed["size_usdc"])
    if final_size is None:
        return False

    # Round to 2 decimal places (USDC cents)
    final_size = float(Decimal(str(final_size)).quantize(Decimal("0.01"), rounding=ROUND_DOWN))

    logger.info(
        "Copying trade: token=%s side=%s price=%.4f size=$%.2f (original $%.2f)",
        parsed["token_id"],
        parsed["side"],
        parsed["price"],
        final_size,
        parsed["size_usdc"],
    )

    try:
        client = get_client()

        # Build an aggressive limit price, rounded to 2dp (Polymarket's tick size).
        # Polymarket only accepts prices at 0.01 increments — using 4dp prices
        # causes the maker USDC amount (token_size * price) to have >2dp, which
        # the API rejects.  BUY rounds up to stay aggressive; SELL rounds down.
        raw_price = parsed["price"]
        _raw = Decimal(str(raw_price))
        _slip = Decimal(str(config.MAX_SLIPPAGE_PCT))
        if parsed["side"] == BUY:
            _lp_dec = min(_raw * (1 + _slip), Decimal("0.99")).quantize(
                Decimal("0.01"), rounding=ROUND_UP
            )
        else:
            _lp_dec = max(_raw * (1 - _slip), Decimal("0.01")).quantize(
                Decimal("0.01"), rounding=ROUND_DOWN
            )
        limit_price = float(_lp_dec)

        # For price P/100, token_size must be a multiple of 10000/gcd(P,10000)/10000
        # so that token_size * price is exactly 2dp.  Example: price=0.61 → P=61,
        # gcd(61,10000)=1 → step=1 (integer tokens only).  price=0.50 → step=0.02.
        _P = int((_lp_dec * 100).to_integral_value())
        _step = Decimal(10000 // _gcd(_P, 10000)) / Decimal(10000)
        _usdc = Decimal(str(final_size)).quantize(Decimal("0.01"), rounding=ROUND_DOWN)
        token_size = float((_usdc / _lp_dec // _step) * _step)

        logger.info(
            "Limit price: %.4f (target %.4f + %.0f%% slippage), tokens: %.4f",
            limit_price, raw_price, config.MAX_SLIPPAGE_PCT * 100, token_size,
        )

        order_args = OrderArgs(
            token_id=parsed["token_id"],
            price=limit_price,
            size=token_size,
            side=parsed["side"],
        )
        # FOK: fill the whole order at this price or better, or cancel.
        # Never leaves a resting order, never overpays beyond our limit.
        signed_order = client.create_order(order_args)
        resp = client.post_order(signed_order, OrderType.FOK)
        logger.info("Order submitted: %s", resp)
        return True

    except PolyApiException as exc:
        logger.error("Polymarket API error placing order: %s", exc)
        return False
    except Exception as exc:
        logger.error("Unexpected error placing order: %s", exc)
        return False
