"""
executor.py - Places a mirrored trade on Polymarket.

Given a raw trade dict from the monitor, this module:
  1. Parses the trade into the fields we need (market, outcome, side, size, price)
  2. Scales the size by COPY_FRACTION and clamps it to configured limits
  3. Uses py-clob-client to submit a market or limit order on your behalf
"""

import logging
from decimal import Decimal, ROUND_DOWN

from py_clob_client.client import ClobClient
from py_clob_client.clob_types import (
    ApiCreds,
    MarketOrderArgs,
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
    )
    # Derive API credentials from the private key (creates them if needed)
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
        order_args = MarketOrderArgs(
            token_id=parsed["token_id"],
            amount=final_size,          # USDC amount to spend
        )
        # Use a market order so it fills immediately at the best available price,
        # matching what the target trader likely got.
        signed_order = client.create_market_order(order_args)
        resp = client.post_order(signed_order, OrderType.FOK)  # Fill-or-Kill
        logger.info("Order submitted: %s", resp)
        return True

    except PolyApiException as exc:
        logger.error("Polymarket API error placing order: %s", exc)
        return False
    except Exception as exc:
        logger.error("Unexpected error placing order: %s", exc)
        return False
