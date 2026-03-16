"""
pnl.py — Lightweight SQLite P&L tracker.

Every copied trade is appended to a local database so you can review
history and calculate realized P&L when positions close.

Schema
------
trades(id, ts, token_id, side, price, size_usdc, tx_hash)

Usage
-----
    import pnl
    pnl.record_trade("123456...", "BUY", 0.61, 10.00, tx_hash="0xabc...")
    for row in pnl.summary():
        print(row)
"""

import logging
import sqlite3
import time

import config

logger = logging.getLogger(__name__)


def _conn() -> sqlite3.Connection:
    db = sqlite3.connect(config.DB_PATH)
    db.execute("""
        CREATE TABLE IF NOT EXISTS trades (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            ts        REAL    NOT NULL,
            token_id  TEXT    NOT NULL,
            side      TEXT    NOT NULL,
            price     REAL    NOT NULL,
            size_usdc REAL    NOT NULL,
            tx_hash   TEXT    NOT NULL DEFAULT ''
        )
    """)
    db.commit()
    return db


def record_trade(
    token_id: str,
    side: str,
    price: float,
    size_usdc: float,
    tx_hash: str = "",
) -> None:
    """Persist one copied trade to the local DB. Safe to call from any thread."""
    try:
        with _conn() as db:
            db.execute(
                "INSERT INTO trades (ts, token_id, side, price, size_usdc, tx_hash) "
                "VALUES (?, ?, ?, ?, ?, ?)",
                (time.time(), token_id, side, price, size_usdc, tx_hash),
            )
    except Exception as exc:
        logger.warning("Could not record trade to DB: %s", exc)


def summary() -> list[dict]:
    """
    Return a per-token P&L summary using average-cost matching.

    Each dict contains:
      token_id      — outcome token identifier
      realized_pnl  — USDC profit/loss on closed portions
      open_cost     — USDC spent on still-open position
      open_shares   — shares currently held
    """
    try:
        with _conn() as db:
            rows = db.execute(
                "SELECT token_id, side, price, size_usdc "
                "FROM trades ORDER BY ts"
            ).fetchall()
    except Exception as exc:
        logger.warning("Could not read trades DB: %s", exc)
        return []

    positions: dict[str, dict] = {}
    for token_id, side, price, size_usdc in rows:
        p = positions.setdefault(
            token_id, {"cost": 0.0, "shares": 0.0, "realized": 0.0}
        )
        shares = size_usdc / price if price > 0 else 0.0
        if side == "BUY":
            p["cost"] += size_usdc
            p["shares"] += shares
        else:
            avg_cost = p["cost"] / p["shares"] if p["shares"] > 0 else 0.0
            p["realized"] += size_usdc - avg_cost * shares
            p["cost"] -= avg_cost * shares
            p["shares"] -= shares

    return [
        {
            "token_id": token_id,
            "realized_pnl": round(v["realized"], 4),
            "open_cost": round(v["cost"], 4),
            "open_shares": round(v["shares"], 4),
        }
        for token_id, v in positions.items()
        if v["cost"] > 0.001 or abs(v["realized"]) > 0.001
    ]
