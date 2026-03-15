#!/usr/bin/env python3
"""
copier.py — Polymarket Trade Copier
=====================================
Watches a target Polymarket trader and automatically mirrors their trades
onto your own account, scaled by your chosen fraction.

Usage:
    python copier.py                          # Uses TARGET_ADDRESS from .env
    python copier.py --username RN1           # Resolve address from username
    python copier.py --dry-run                # Print trades without placing orders
    python copier.py --dry-run --username RN1 # Combine both
"""

import argparse
import logging
import sys

import colorlog

import config
from monitor import TradeMonitor, lookup_address_by_username
from executor import copy_trade


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
        "--dry-run",
        action="store_true",
        help="Print detected trades but do NOT place any orders.",
    )
    return parser.parse_args()


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

    if args.dry_run:
        logger.info("*** DRY RUN MODE — no real orders will be placed ***")

    logger.info("=" * 60)
    logger.info("Polymarket Trade Copier starting up")
    logger.info("  Target trader : %s", target_address)
    logger.info("  Copy fraction : %.0f%%", config.COPY_FRACTION * 100)
    logger.info("  Max per trade : $%.2f USDC", config.MAX_TRADE_SIZE_USDC)
    logger.info("  Min per trade : $%.2f USDC", config.MIN_TRADE_SIZE_USDC)
    logger.info("  Poll interval : %ds", config.POLL_INTERVAL_SECONDS)
    logger.info("  Dry run       : %s", args.dry_run)
    logger.info("=" * 60)

    monitor = TradeMonitor(target_address)
    copied = 0
    skipped = 0

    for trade in monitor.poll_forever():
        market = (
            trade.get("market")
            or trade.get("conditionId")
            or trade.get("slug")
            or "unknown market"
        )
        side = trade.get("side", "?")
        price = trade.get("price") or trade.get("outcomePrice") or "?"
        amount = trade.get("usdcSize") or trade.get("amount") or "?"

        logger.info(
            "NEW TRADE DETECTED | market: %s | side: %s | price: %s | amount: $%s",
            market, side, price, amount,
        )

        if args.dry_run:
            logger.info("  [DRY RUN] Would copy this trade — skipping execution.")
            skipped += 1
            continue

        success = copy_trade(trade)
        if success:
            copied += 1
            logger.info("  Trade copied successfully. Total copied: %d", copied)
        else:
            skipped += 1
            logger.warning("  Trade could not be copied. Total skipped: %d", skipped)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nStopped by user.")
