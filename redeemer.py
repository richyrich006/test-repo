"""
redeemer.py — Auto-redeem resolved Polymarket positions back to USDC.

When a market resolves, winning conditional tokens sit idle until redeemed.
This module finds those positions via the Polymarket API and redeems them
through your Gnosis Safe proxy wallet on-chain.

Called automatically by the copier every hour, or run manually:
    python redeemer.py
"""

import logging
import os
import sys

import requests
from eth_abi import encode as _abi_encode
from web3 import Web3

import config

# Selector for redeemPositions(address,bytes32,bytes32,uint256[])
_REDEEM_SELECTOR = Web3.keccak(
    text="redeemPositions(address,bytes32,bytes32,uint256[])"
)[:4]

logger = logging.getLogger(__name__)

# ── Polygon mainnet addresses ────────────────────────────────────────────────
USDC_ADDRESS = Web3.to_checksum_address("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174")
CTF_ADDRESS  = Web3.to_checksum_address("0x4D97DCd97eC945f40cF65F87097ACe5EA0476045")
ZERO_ADDR    = "0x0000000000000000000000000000000000000000"
BYTES32_ZERO = b"\x00" * 32

CTF_ABI = [{
    "name": "redeemPositions",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
        {"name": "collateralToken",      "type": "address"},
        {"name": "parentCollectionId",   "type": "bytes32"},
        {"name": "conditionId",          "type": "bytes32"},
        {"name": "indexSets",            "type": "uint256[]"},
    ],
    "outputs": [],
}]

# Minimal Gnosis Safe ABI — only execTransaction
SAFE_ABI = [{
    "name": "execTransaction",
    "type": "function",
    "stateMutability": "payable",
    "inputs": [
        {"name": "to",              "type": "address"},
        {"name": "value",           "type": "uint256"},
        {"name": "data",            "type": "bytes"},
        {"name": "operation",       "type": "uint8"},
        {"name": "safeTxGas",       "type": "uint256"},
        {"name": "baseGas",         "type": "uint256"},
        {"name": "gasPrice",        "type": "uint256"},
        {"name": "gasToken",        "type": "address"},
        {"name": "refundReceiver",  "type": "address"},
        {"name": "signatures",      "type": "bytes"},
    ],
    "outputs": [{"name": "success", "type": "bool"}],
}]


def _get_web3() -> Web3:
    ws = config.WEB3_WS_URL
    http = ws.replace("wss://", "https://").replace("ws://", "http://") if ws else "https://polygon-rpc.com"
    return Web3(Web3.HTTPProvider(http))


def _fetch_redeemable(proxy_address: str) -> list[dict]:
    """
    Query Polymarket's positions API for resolved positions we can redeem.
    Returns a list of position dicts that include a conditionId.
    """
    try:
        resp = requests.get(
            f"{config.DATA_API_URL}/positions",
            params={"user": proxy_address, "sizeThreshold": "0.01"},
            timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()
        if isinstance(data, dict):
            data = data.get("data", [])
    except requests.RequestException as exc:
        logger.warning("Could not fetch positions: %s", exc)
        return []

    redeemable = []
    for pos in data:
        size = float(pos.get("size") or pos.get("currentValue") or 0)
        if size <= 0:
            continue
        cid = pos.get("conditionId") or pos.get("condition_id")
        if not cid:
            continue
        # Accept positions that are marked redeemable, OR where the market is resolved
        if pos.get("redeemable") or pos.get("game_status") == "closed" or pos.get("closed"):
            redeemable.append(pos)

    return redeemable


def _exec_via_safe(w3: Web3, safe_addr: str, owner_addr: str, private_key: str,
                   to: str, data: bytes) -> str:
    """
    Route a transaction through a Gnosis Safe (threshold=1).
    Uses the 'msg.sender is owner' pre-validated signature (v=1).
    """
    # Gnosis Safe signature type v=1: r=owner address, s=0, v=1
    # This tells the Safe "the caller (msg.sender) is an owner and approves this tx"
    sig_r = int(owner_addr, 16).to_bytes(32, "big")
    sig_s = (0).to_bytes(32, "big")
    sig_v = bytes([1])
    signatures = sig_r + sig_s + sig_v

    safe = w3.eth.contract(address=Web3.to_checksum_address(safe_addr), abi=SAFE_ABI)
    nonce = w3.eth.get_transaction_count(owner_addr)

    tx = safe.functions.execTransaction(
        Web3.to_checksum_address(to),
        0,            # value
        data,
        0,            # operation: CALL
        0,            # safeTxGas
        0,            # baseGas
        0,            # gasPrice
        ZERO_ADDR,    # gasToken
        ZERO_ADDR,    # refundReceiver
        signatures,
    ).build_transaction({
        "from": owner_addr,
        "nonce": nonce,
        "gas": 250_000,
        "gasPrice": w3.eth.gas_price,
    })
    signed = w3.eth.account.sign_transaction(tx, private_key)
    txhash = w3.eth.send_raw_transaction(signed.raw_transaction)
    w3.eth.wait_for_transaction_receipt(txhash, timeout=120)
    return txhash.hex()


def redeem_all() -> int:
    """
    Find and redeem all resolved winning positions.
    Returns the number of positions successfully redeemed.
    """
    proxy_address = config.POLY_PROXY_ADDRESS.lower()
    if not proxy_address:
        logger.warning("POLY_PROXY_ADDRESS not set — skipping redemption.")
        return 0

    positions = _fetch_redeemable(proxy_address)
    if not positions:
        logger.info("No redeemable positions found.")
        return 0

    logger.info("Found %d redeemable position(s) — redeeming now.", len(positions))

    w3 = _get_web3()
    if not w3.is_connected():
        logger.error("Cannot connect to Polygon RPC — skipping redemption.")
        return 0

    account = w3.eth.account.from_key(config.PRIVATE_KEY)
    owner_addr = account.address

    redeemed = 0
    for pos in positions:
        cid_str = (pos.get("conditionId") or pos.get("condition_id", "")).lstrip("0x")
        market  = pos.get("market") or pos.get("slug") or cid_str[:12] + "..."
        outcome = pos.get("outcome", "?")
        size    = pos.get("size", "?")

        try:
            cid_bytes = bytes.fromhex(cid_str).rjust(32, b"\x00")
        except ValueError:
            logger.warning("Bad conditionId '%s' — skipping.", cid_str)
            continue

        logger.info("Redeeming: market=%s outcome=%s size=%s", market, outcome, size)

        # Pass both indexSets [1, 2] — CTF pays only for positions we actually hold.
        # indexSet 1 = outcome 0 (YES), indexSet 2 = outcome 1 (NO).
        # Use eth_abi directly to avoid web3.py version differences.
        data = _REDEEM_SELECTOR + _abi_encode(
            ["address", "bytes32", "bytes32", "uint256[]"],
            [USDC_ADDRESS, BYTES32_ZERO, cid_bytes, [1, 2]],
        )

        try:
            txhash = _exec_via_safe(w3, proxy_address, owner_addr, config.PRIVATE_KEY,
                                    CTF_ADDRESS, data)
            logger.info("  Redeemed — tx: %s", txhash)
            redeemed += 1
        except Exception as exc:
            logger.error("  Redemption failed: %s", exc)

    return redeemed


# ── Standalone entry point ───────────────────────────────────────────────────
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s  %(message)s")
    n = redeem_all()
    print(f"\nDone — {n} position(s) redeemed.")
