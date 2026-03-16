"""
executor.py - Places a mirrored trade on Polymarket.

Given a raw trade dict from the monitor, this module:
  1. Parses the trade into the fields we need (market, outcome, side, size, price)
  2. Scales the size by COPY_FRACTION and clamps it to configured limits
  3. Checks we hold the token before placing a SELL (avoids pointless failed orders)
  4. Uses py-clob-client to submit a FOK limit order on your behalf
  5. Retries up to 2 times on transient network errors before giving up
"""

import logging
import threading
import time
from decimal import Decimal, ROUND_DOWN, ROUND_UP
from math import gcd as _gcd

import requests
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

# Each thread gets its own ClobClient so concurrent copy_trade calls don't
# share mutable client state.
_local = threading.local()


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


def get_client() -> ClobClient:
    """Return this thread's ClobClient, creating one on first use."""
    if not hasattr(_local, "client"):
        _local.client = _build_client()
    return _local.client


def _parse_side(trade: dict) -> str:
    side = str(trade.get("side", "BUY")).upper()
    return BUY if side == "BUY" else SELL


def _parse_trade(trade: dict) -> dict | None:
    """
    Extract the fields needed to place an order.
    Returns a dict with keys: token_id, side, price, size_usdc
    or None if the trade can't be parsed.
    """
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
    Returns None if the result is below the minimum.
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


def _has_position(token_id: str) -> bool:
    """
    Return True if our proxy wallet holds any of this outcome token.
    Used to skip SELL orders when we have nothing to sell.
    Falls back to True (proceed) if the check fails.
    """
    if not config.POLY_PROXY_ADDRESS:
        return True  # can't check without a proxy address
    try:
        resp = requests.get(
            f"{config.DATA_API_URL}/positions",
            params={"user": config.POLY_PROXY_ADDRESS, "sizeThreshold": "0"},
            timeout=5,
        )
        resp.raise_for_status()
        for pos in resp.json():
            if str(pos.get("asset", "")) == str(token_id):
                return float(pos.get("size", 0)) > 0
        return False
    except Exception as exc:
        logger.warning("Position check failed: %s — proceeding with SELL.", exc)
        return True  # fail-safe: let the order attempt


def _submit_with_retry(order_args: OrderArgs, client: ClobClient, max_attempts: int = 3) -> dict:
    """
    Create and post a FOK order, retrying up to *max_attempts* times on
    transient errors. Re-raises on the final failure or on API errors
    (which indicate a bad request that retrying won't fix).
    """
    for attempt in range(max_attempts):
        try:
            signed_order = client.create_order(order_args)
            return client.post_order(signed_order, OrderType.FOK)
        except PolyApiException:
            raise  # API rejections (bad price, insufficient balance) are not retryable
        except Exception as exc:
            if attempt == max_attempts - 1:
                raise
            wait = 2 ** attempt  # 1s, 2s
            logger.warning(
                "Order attempt %d/%d failed: %s — retrying in %ds.",
                attempt + 1, max_attempts, exc, wait,
            )
            time.sleep(wait)


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

    # Skip SELL orders when we don't hold the token — avoids a doomed API call
    if parsed["side"] == SELL and not _has_position(parsed["token_id"]):
        logger.info(
            "No position in token %s — skipping SELL.", parsed["token_id"][:16] + "..."
        )
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
        resp = _submit_with_retry(order_args, client)
        logger.info("Order submitted: %s", resp)
        return True

    except PolyApiException as exc:
        msg = str(exc).lower()
        if "balance" in msg or "allowance" in msg:
            logger.error(
                "Order rejected — insufficient balance or allowance. "
                "Deposit USDC to your Polymarket proxy wallet and ensure the "
                "CLOB allowance is approved.  Error: %s",
                exc,
            )
        else:
            logger.error("Polymarket API error placing order: %s", exc)
        return False
    except Exception as exc:
        logger.error("Unexpected error placing order: %s", exc)
        return False
