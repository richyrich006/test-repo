#!/usr/bin/env python3
"""
One-time setup: approve Polymarket's exchange contracts to spend your USDC.e
and conditional tokens.  Run this once; you won't need to run it again.

Requires a small amount of POL (MATIC) in the wallet for gas (~$0.01).

Usage:
    python set_allowances.py
"""

import os
import sys
from dotenv import load_dotenv
from web3 import Web3

load_dotenv()

# ── Polygon mainnet contract addresses ──────────────────────────────────────
USDC_ADDRESS = Web3.to_checksum_address("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174")
CTF_ADDRESS  = Web3.to_checksum_address("0x4D97DCd97eC945f40cF65F87097ACe5EA0476045")
SPENDERS = [
    Web3.to_checksum_address("0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E"),  # CLOB Exchange
    Web3.to_checksum_address("0xC5d563A36AE78145C45a50134d48A1215220f80a"),  # Neg Risk CTF Exchange
    Web3.to_checksum_address("0xd91E80cF2E7be2e162c6513ceD06f1dD0dA35296"),  # Neg Risk Adapter
]
MAX_INT = 2**256 - 1

ERC20_ABI = [{
    "name": "approve", "type": "function", "stateMutability": "nonpayable",
    "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
    "outputs": [{"name": "", "type": "bool"}],
}]
ERC1155_ABI = [{
    "name": "setApprovalForAll", "type": "function", "stateMutability": "nonpayable",
    "inputs": [{"name": "operator", "type": "address"}, {"name": "approved", "type": "bool"}],
    "outputs": [],
}]


def _send(w3, contract_fn, address, private_key, nonce):
    tx = contract_fn.build_transaction({
        "from": address,
        "nonce": nonce,
        "gas": 100_000,
        "gasPrice": w3.eth.gas_price,
    })
    signed = w3.eth.account.sign_transaction(tx, private_key)
    txhash = w3.eth.send_raw_transaction(signed.raw_transaction)
    w3.eth.wait_for_transaction_receipt(txhash, timeout=120)
    return txhash.hex()


def main():
    private_key = os.getenv("PRIVATE_KEY")
    if not private_key:
        sys.exit("ERROR: PRIVATE_KEY not set in .env")

    # Use WEB3_WS_URL converted to HTTP, or fall back to public Polygon RPC
    ws_url = os.getenv("WEB3_WS_URL", "")
    if ws_url:
        http_url = ws_url.replace("wss://", "https://").replace("ws://", "http://")
    else:
        http_url = "https://polygon-rpc.com"

    print(f"Connecting to {http_url} ...")
    w3 = Web3(Web3.HTTPProvider(http_url))
    if not w3.is_connected():
        sys.exit(f"ERROR: Could not connect to {http_url}")

    account = w3.eth.account.from_key(private_key)
    address = account.address
    pol_balance = w3.from_wei(w3.eth.get_balance(address), "ether")
    print(f"Wallet : {address}")
    print(f"POL    : {pol_balance:.4f}  (need ~0.01 for gas)")
    if pol_balance < 0.005:
        sys.exit("ERROR: Not enough POL for gas. Send some POL to the wallet above.")
    print()

    usdc = w3.eth.contract(address=USDC_ADDRESS, abi=ERC20_ABI)
    ctf  = w3.eth.contract(address=CTF_ADDRESS,  abi=ERC1155_ABI)
    nonce = w3.eth.get_transaction_count(address)

    for spender in SPENDERS:
        short = spender[:10] + "..."

        print(f"[1/2] Approving USDC.e  → {short}", end=" ", flush=True)
        txhash = _send(w3, usdc.functions.approve(spender, MAX_INT), address, private_key, nonce)
        print(f"✓  {txhash}")
        nonce += 1

        print(f"[2/2] Approving CTF     → {short}", end=" ", flush=True)
        txhash = _send(w3, ctf.functions.setApprovalForAll(spender, True), address, private_key, nonce)
        print(f"✓  {txhash}")
        nonce += 1

    print()
    print("Done — all allowances set.  You only need to run this once.")


if __name__ == "__main__":
    main()
