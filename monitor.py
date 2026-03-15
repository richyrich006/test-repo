"""
monitor.py - Watches a Polymarket trader's activity and yields new trades.

Uses the Polymarket Data API to poll for recent activity from a target
wallet address, tracking which trades have already been seen so only
genuinely new ones are returned.
"""

import logging
import time
from typing import Generator

import requests

import config

logger = logging.getLogger(__name__)

# Polymarket activity endpoint - returns buys/sells for a wallet
_ACTIVITY_URL = f"{config.DATA_API_URL}/activity"

# How many recent trades to fetch per poll (Polymarket max is 500)
_FETCH_LIMIT = 50


def _fetch_recent_activity(address: str) -> list[dict]:
    """Return the most recent trades for *address* from the Data API."""
    params = {
        "user": address,
        "limit": _FETCH_LIMIT,
    }
    try:
        resp = requests.get(_ACTIVITY_URL, params=params, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        # The API returns a list directly or wraps it — handle both
        if isinstance(data, list):
            return data
        return data.get("data", [])
    except requests.RequestException as exc:
        logger.warning("Failed to fetch activity for %s: %s", address, exc)
        return []


def _trade_id(trade: dict) -> str:
    """Stable unique identifier for a trade record."""
    # Prefer the transaction hash; fall back to a combination of fields
    return (
        trade.get("transactionHash")
        or trade.get("id")
        or f"{trade.get('timestamp')}-{trade.get('size')}-{trade.get('price')}"
    )


class TradeMonitor:
    """
    Polls the Polymarket Data API for new trades by a target address.

    Usage::

        monitor = TradeMonitor(target_address="0x...")
        for trade in monitor.poll_forever():
            print("New trade:", trade)
    """

    def __init__(self, target_address: str):
        self.target_address = target_address.lower()
        # Seed with existing trades so we don't re-copy old history
        self._seen_ids: set[str] = self._seed()

    def _seed(self) -> set[str]:
        """Record all currently-known trade IDs so we skip them on first run."""
        logger.info(
            "Seeding known trades for %s (these will NOT be copied)...",
            self.target_address,
        )
        trades = _fetch_recent_activity(self.target_address)
        ids = {_trade_id(t) for t in trades}
        logger.info("Seeded %d existing trades — will copy only NEW trades.", len(ids))
        return ids

    def get_new_trades(self) -> list[dict]:
        """Fetch trades and return only ones not seen before."""
        trades = _fetch_recent_activity(self.target_address)
        new_trades = []
        for trade in trades:
            tid = _trade_id(trade)
            if tid not in self._seen_ids:
                self._seen_ids.add(tid)
                new_trades.append(trade)
        if new_trades:
            logger.info("Detected %d new trade(s).", len(new_trades))
        return new_trades

    def poll_forever(self) -> Generator[dict, None, None]:
        """
        Infinite generator that yields new trades as they appear.
        Sleeps for POLL_INTERVAL_SECONDS between checks.
        """
        logger.info(
            "Monitoring %s — polling every %ds",
            self.target_address,
            config.POLL_INTERVAL_SECONDS,
        )
        while True:
            for trade in self.get_new_trades():
                yield trade
            time.sleep(config.POLL_INTERVAL_SECONDS)


def lookup_address_by_username(username: str) -> str | None:
    """
    Attempt to resolve a Polymarket username to a wallet address.
    Returns the address string, or None if not found.
    """
    url = f"{config.GAMMA_API_URL}/profiles"
    try:
        resp = requests.get(url, params={"username": username}, timeout=15)
        resp.raise_for_status()
        profiles = resp.json()
        if profiles:
            addr = profiles[0].get("proxyWallet") or profiles[0].get("address")
            if addr:
                logger.info("Resolved username '%s' -> %s", username, addr)
                return addr.lower()
    except requests.RequestException as exc:
        logger.warning("Username lookup failed: %s", exc)
    return None
