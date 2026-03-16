#!/usr/bin/env python3
"""
copier.py — Polymarket Trade Copier
=====================================
Watches a target Polymarket trader and automatically mirrors their trades
onto your own account, scaled by your chosen fraction.

Modes:
  live  (default) — subscribes to the Polygon blockchain via WebSocket.
                    Latency: ~2-5 seconds. Requires WEB3_WS_URL in .env.
  poll            — periodically polls the Polymarket REST API.
                    Latency: ~10-60 seconds. No extra setup needed.

Usage:
    python copier.py                              # live mode (fastest)
    python copier.py --mode poll                  # polling fallback
    python copier.py --username RN1               # resolve address from username
    python copier.py --dry-run                    # print trades, no real orders
    python copier.py --dry-run --username RN1     # combine
"""

import argparse
import logging
import sys
import threading
import time

import colorlog

import config
from monitor import TradeMonitor, lookup_address_by_username
from executor import copy_trade
from redeemer import redeem_all

# ── Background redemption thread ───────────────────────────────────────────────
_REDEEM_INTERVAL = 600  # check for redeemable positions every 10 minutes

def _redemption_loop(logger: logging.Logger) -> None:
    """Periodically redeem resolved winning positions back to USDC."""
    while True:
        time.sleep(_REDEEM_INTERVAL)
        try:
            logger.info("Checking for redeemable positions...")
            n = redeem_all()
            if n:
                logger.info("Auto-redeemed %d position(s) to USDC.", n)
        except Exception as exc:
            logger.warning("Redemption check failed: %s", exc)


# ── Logging setup ──────────────────────────────────────────────────────────────

def setup_logging() -> None:
    handler = colorlog.StreamHandler()
    handler.setFormatter(colorlog.ColoredFormatter(
        "%(log_color)s%(asctime)s [%(levelname)s]%(reset)s %(message)s",
        datefmt="%H:%M:%S",
        log_colors={
            "DEBUG":    "cyan",
            "INFO":     "green",
            "WARNING":  "yellow",
            "ERROR":    "red",
            "CRITICAL": "bold_red",
        },
    ))
    root = logging.getLogger()
    root.setLevel(logging.INFO)
    root.addHandler(handler)


# ── CLI ────────────────────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Polymarket Trade Copier — mirrors another trader's activity."
    )
    parser.add_argument(
        "--username",
        help="Polymarket username to copy (e.g. 'RN1'). Overrides TARGET_ADDRESS in .env.",
        default=None,
    )
    parser.add_argument(
        "--mode",
        choices=["live", "poll"],
        default="live",
        help=(
            "live (default): blockchain WebSocket, ~2-5s latency. "
            "poll: REST API polling, ~10-60s latency."
        ),
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print detected trades but do NOT place any orders.",
    )
    return parser.parse_args()


# ── Trade handler (shared by both modes) ──────────────────────────────────────

def handle_trade(trade: dict, dry_run: bool, counters: dict, logger: logging.Logger) -> None:
    """Process a single detected trade — log it and optionally copy it."""
    market = (
        trade.get("market")
        or trade.get("conditionId")
        or trade.get("asset")
        or trade.get("slug")
        or "unknown market"
    )
    side   = trade.get("side", "?")
    price  = trade.get("price") or trade.get("outcomePrice") or "?"
    amount = trade.get("usdcSize") or trade.get("amount") or "?"
    source = trade.get("_source", "api")

    logger.info(
        "NEW TRADE [%s] | market: %s | side: %s | price: %s | amount: $%s",
        source, market, side, price, amount,
    )

    if dry_run:
        logger.info("  [DRY RUN] Would copy this trade — skipping execution.")
        counters["skipped"] += 1
        return

    success = copy_trade(trade)
    if success:
        counters["copied"] += 1
        logger.info("  Trade copied successfully. Total copied: %d", counters["copied"])
    else:
        counters["skipped"] += 1
        logger.warning("  Trade could not be copied. Total skipped: %d", counters["skipped"])


# ── Main ───────────────────────────────────────────────────────────────────────

def main() -> None:
    setup_logging()
    logger = logging.getLogger(__name__)
    args = parse_args()

    # Resolve target address
    target_address = config.TARGET_ADDRESS
    if args.username:
        resolved = lookup_address_by_username(args.username)
        if not resolved:
            logger.error(
                "Could not resolve username '%s' to a wallet address. "
                "Look up their profile on polymarket.com and set TARGET_ADDRESS manually.",
                args.username,
            )
            sys.exit(1)
        target_address = resolved

    # Validate live mode requirements
    if args.mode == "live" and not config.WEB3_WS_URL:
        logger.error(
            "Live mode requires WEB3_WS_URL in your .env file.\n"
            "  Get a free URL from https://dashboard.alchemy.com/ (Polygon mainnet, WebSockets)\n"
            "  Or run with --mode poll to use the slower REST API fallback."
        )
        sys.exit(1)

    if args.dry_run:
        logger.info("*** DRY RUN MODE — no real orders will be placed ***")

    logger.info("=" * 60)
    logger.info("Polymarket Trade Copier starting up")
    logger.info("  Target trader : %s", target_address)
    logger.info("  Mode          : %s", args.mode)
    logger.info("  Copy fraction : %.0f%%", config.COPY_FRACTION * 100)
    logger.info("  Max per trade : $%.2f USDC", config.MAX_TRADE_SIZE_USDC)
    logger.info("  Min per trade : $%.2f USDC", config.MIN_TRADE_SIZE_USDC)
    logger.info("  Dry run       : %s", args.dry_run)
    logger.info("=" * 60)

    counters = {"copied": 0, "skipped": 0}

    # Start background thread that redeems resolved positions every hour
    if not args.dry_run and config.POLY_PROXY_ADDRESS:
        t = threading.Thread(target=_redemption_loop, args=(logger,), daemon=True)
        t.start()
        logger.info("Auto-redemption enabled — will check every 10 minutes.")

    if args.mode == "live":
        # ── Live mode: blockchain WebSocket (~2-5s latency) ──────────────────
        from blockchain_monitor import run_stream

        logger.info(
            "Live mode active — watching the Polygon blockchain in real time."
        )
        run_stream(
            target_address=target_address,
            ws_url=config.WEB3_WS_URL,
            on_trade_callback=lambda t: handle_trade(t, args.dry_run, counters, logger),
        )

    else:
        # ── Poll mode: REST API (~10-60s latency) ─────────────────────────────
        logger.info(
            "Poll mode active — checking every %ds.", config.POLL_INTERVAL_SECONDS
        )
        monitor = TradeMonitor(target_address)
        for trade in monitor.poll_forever():
            handle_trade(trade, args.dry_run, counters, logger)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nStopped by user.")
