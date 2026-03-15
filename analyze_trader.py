"""
analyze_trader.py
Run this locally:  python analyze_trader.py

Fetches full trade + position history for a Polymarket address and outputs
a capital-requirement analysis so you know how much USDC to hold in order to
replicate every trade without missing one.
"""

import json
import statistics
import sys
from datetime import datetime, timezone
from typing import Any

import requests

# ── config ────────────────────────────────────────────────────────────────────
TARGET = "0x2005d16a84ceefa912d4e380cd32e7ff827875ea"
HEADERS = {"User-Agent": "Mozilla/5.0"}
PAGE_SIZE = 500
# ─────────────────────────────────────────────────────────────────────────────


def paginate(url_template: str, key: str | None = None) -> list[dict]:
    """Fetch all pages from a cursor/offset-based endpoint."""
    results = []
    offset = 0
    while True:
        url = url_template.format(offset=offset, limit=PAGE_SIZE)
        try:
            r = requests.get(url, headers=HEADERS, timeout=15)
            r.raise_for_status()
            data = r.json()
        except Exception as e:
            print(f"  [warn] {url[:80]} → {e}")
            break

        page = data if isinstance(data, list) else data.get(key or "data", data)
        if not page:
            break
        results.extend(page)
        print(f"  fetched {len(results)} records so far...")
        if len(page) < PAGE_SIZE:
            break
        offset += PAGE_SIZE
    return results


def fetch_activity() -> list[dict]:
    print("\n[1/3] Fetching activity (data-api)...")
    url = (
        f"https://data-api.polymarket.com/activity"
        f"?user={TARGET}&limit={{limit}}&offset={{offset}}"
    )
    return paginate(url)


def fetch_positions() -> list[dict]:
    print("\n[2/3] Fetching open positions (data-api)...")
    url = (
        f"https://data-api.polymarket.com/positions"
        f"?user={TARGET}&limit={{limit}}&offset={{offset}}&sizeThreshold=.1"
    )
    return paginate(url)


def fetch_clob_trades() -> list[dict]:
    """Try both maker and taker sides from the CLOB API."""
    print("\n[3/3] Fetching CLOB trades...")
    results = []
    for role in ("maker_address", "taker_address"):
        url = (
            f"https://clob.polymarket.com/trades"
            f"?{role}={TARGET}&limit={{limit}}&offset={{offset}}"
        )
        chunk = paginate(url, key="data")
        print(f"  {role}: {len(chunk)} trades")
        results.extend(chunk)

    # De-duplicate by trade id if present
    seen: set[str] = set()
    unique = []
    for t in results:
        tid = t.get("id") or t.get("trade_id") or json.dumps(t, sort_keys=True)
        if tid not in seen:
            seen.add(tid)
            unique.append(t)
    return unique


# ── helpers ───────────────────────────────────────────────────────────────────

def _usdc(raw: Any) -> float:
    """Convert a raw size field to a float USDC amount (handles string/float/int)."""
    try:
        return float(raw)
    except (TypeError, ValueError):
        return 0.0


def _ts(raw: Any) -> datetime | None:
    """Parse a unix timestamp or ISO string to datetime."""
    if not raw:
        return None
    try:
        ts = float(raw)
        return datetime.fromtimestamp(ts, tz=timezone.utc)
    except (TypeError, ValueError):
        pass
    try:
        return datetime.fromisoformat(str(raw).replace("Z", "+00:00"))
    except ValueError:
        return None


# ── analysis ──────────────────────────────────────────────────────────────────

def analyze(activity: list[dict], positions: list[dict], clob: list[dict]) -> None:
    print("\n" + "=" * 70)
    print("TRADE ANALYSIS — RN1 (@RN1)")
    print(f"Address: {TARGET}")
    print("=" * 70)

    # ------------------------------------------------------------------
    # 1.  Build a unified list of trade sizes from every source
    # ------------------------------------------------------------------
    trade_sizes: list[float] = []
    trade_times: list[datetime] = []

    # activity records look like: {type, usdcSize, timestamp, title, side, ...}
    buys_usdc: list[float] = []
    for rec in activity:
        if rec.get("type") not in ("BUY", "SELL", "buy", "sell", None):
            pass  # keep everything — redemptions, etc. filtered below
        size = _usdc(rec.get("usdcSize") or rec.get("size") or rec.get("amount") or 0)
        if size > 0:
            trade_sizes.append(size)
            if rec.get("type", "").upper() in ("", "BUY", "SELL"):
                buys_usdc.append(size)
        t = _ts(rec.get("timestamp") or rec.get("created_at"))
        if t:
            trade_times.append(t)

    # CLOB records: makerAmountFilled or takerAmountFilled in 1e6 units
    for rec in clob:
        # amounts are in 1e6 USDC for the price token
        raw = rec.get("makerAmountFilled") or rec.get("takerAmountFilled") or 0
        size = _usdc(raw) / 1e6
        if size > 0.01:
            trade_sizes.append(size)
        t = _ts(rec.get("timestamp") or rec.get("created_at") or rec.get("time"))
        if t:
            trade_times.append(t)

    # ------------------------------------------------------------------
    # 2.  Open positions — how much capital is currently deployed
    # ------------------------------------------------------------------
    open_value = sum(
        _usdc(p.get("currentValue") or p.get("value") or 0) for p in positions
    )
    open_positions_count = len(positions)

    # ------------------------------------------------------------------
    # 3.  Stats
    # ------------------------------------------------------------------
    if not trade_sizes:
        print("\n[!] No trade size data found. Raw samples:")
        for src, records in [("activity", activity), ("clob", clob)]:
            if records:
                print(f"\n  {src}[0]: {json.dumps(records[0], indent=2)[:400]}")
        return

    trade_sizes.sort()
    n = len(trade_sizes)
    mean_size   = statistics.mean(trade_sizes)
    median_size = statistics.median(trade_sizes)
    min_size    = trade_sizes[0]
    max_size    = trade_sizes[-1]
    p90_size    = trade_sizes[int(n * 0.90)]
    p95_size    = trade_sizes[int(n * 0.95)]
    total_volume = sum(trade_sizes)

    # Frequency
    if len(trade_times) >= 2:
        trade_times.sort()
        span_days = (trade_times[-1] - trade_times[0]).total_seconds() / 86400
        trades_per_day = n / span_days if span_days > 0 else n
        date_range = f"{trade_times[0].strftime('%Y-%m-%d')} → {trade_times[-1].strftime('%Y-%m-%d')}"
    else:
        span_days = None
        trades_per_day = None
        date_range = "unknown"

    print(f"\n{'─'*40}")
    print("TRADE STATISTICS")
    print(f"{'─'*40}")
    print(f"Total trades analyzed : {n}")
    print(f"Date range            : {date_range}")
    if trades_per_day:
        print(f"Avg trades / day      : {trades_per_day:.1f}  ({trades_per_day*7:.1f}/week)")
    print(f"\nTrade size (USDC)")
    print(f"  Min                 : ${min_size:,.2f}")
    print(f"  Mean                : ${mean_size:,.2f}")
    print(f"  Median              : ${median_size:,.2f}")
    print(f"  P90                 : ${p90_size:,.2f}")
    print(f"  P95                 : ${p95_size:,.2f}")
    print(f"  Max                 : ${max_size:,.2f}")
    print(f"\nTotal volume          : ${total_volume:,.2f}")

    print(f"\n{'─'*40}")
    print("OPEN POSITIONS")
    print(f"{'─'*40}")
    print(f"Count                 : {open_positions_count}")
    print(f"Current value (USDC)  : ${open_value:,.2f}")

    # ------------------------------------------------------------------
    # 4.  Capital requirement recommendation
    # ------------------------------------------------------------------
    print(f"\n{'─'*40}")
    print("CAPITAL RECOMMENDATION")
    print(f"{'─'*40}")

    # Worst-case simultaneous deployment: open positions + 1 new trade
    worst_simultaneous = open_value + p95_size

    # Scaled recommendations (you pick your allocation %)
    print("\nTo replicate EVERY trade (proportional sizing):")
    print("  These budgets assume you size each trade at the SAME % of your")
    print("  bankroll that the target uses of theirs.\n")

    # Estimate target bankroll from their largest recent position cluster
    # Conservative: assume they have ~2x the open position value as total bankroll
    est_target_bankroll = open_value * 2 if open_value > 0 else max_size * 10
    print(f"  Estimated target bankroll (rough): ~${est_target_bankroll:,.0f}")
    print()

    for pct in (5, 10, 20, 50, 100):
        scaled = (pct / 100) * est_target_bankroll
        # You need enough to cover the largest simultaneous deployment at that scale
        needed = max(scaled, (pct / 100) * worst_simultaneous)
        print(f"  At {pct:3d}% of their size  →  keep ${needed:>10,.0f} USDC available")

    print()
    print("MINIMUM to never miss a trade:")
    # Need at least: (your_ratio) * max_single_trade + buffer for open positions
    print(f"  Absolute floor (cover max trade, no positions) : ${max_size:,.2f}")
    print(f"  Comfortable buffer (P95 trade + open exposure) : ${worst_simultaneous:,.2f}")
    print()
    print("RULE OF THUMB:")
    print(f"  Keep at least 2×P95 trade size in liquid USDC  : ${p95_size*2:,.2f}")
    print(f"  Total portfolio (including positions)          : ${worst_simultaneous * 1.5:,.2f}")


# ── main ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    activity  = fetch_activity()
    positions = fetch_positions()
    clob      = fetch_clob_trades()

    print(f"\nRaw counts — activity:{len(activity)}  positions:{len(positions)}  clob:{len(clob)}")

    # Dump raw data for inspection
    with open("trader_data.json", "w") as f:
        json.dump({"activity": activity, "positions": positions, "clob": clob}, f, indent=2)
    print("Raw data saved to trader_data.json")

    analyze(activity, positions, clob)
