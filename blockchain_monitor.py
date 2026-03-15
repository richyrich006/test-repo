"""
blockchain_monitor.py - Near real-time trade detection via Polygon WebSocket.

Instead of polling the Polymarket REST API (30-90s lag), this module
subscribes directly to the Polygon blockchain and listens for
OrderFilled events emitted by the Polymarket exchange contracts.

Latency: ~2-5 seconds (one Polygon block time).

How it works:
  1. Open a WebSocket connection to a Polygon RPC node.
  2. Subscribe to log events from the CTFExchange contracts.
  3. For each log, decode the OrderFilled event.
  4. If the target address is the maker or taker, yield the trade.
"""

import asyncio
import logging
from typing import AsyncGenerator

from web3 import AsyncWeb3
from web3.providers.persistent import WebSocketProvider

import config

logger = logging.getLogger(__name__)

# ── Polymarket contract addresses on Polygon mainnet ──────────────────────────
# CTFExchange handles standard Yes/No markets.
CTF_EXCHANGE = "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E"
# NegRiskCTFExchange handles multi-outcome markets (e.g. election winners).
NEG_RISK_CTF_EXCHANGE = "0xC5d563A36AE78145C45a50134d48A1215220f80a"

EXCHANGE_ADDRESSES = [CTF_EXCHANGE, NEG_RISK_CTF_EXCHANGE]

# ── OrderFilled ABI (only the event we care about) ───────────────────────────
ORDER_FILLED_ABI = [
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True,  "name": "orderHash",         "type": "bytes32"},
            {"indexed": True,  "name": "maker",             "type": "address"},
            {"indexed": True,  "name": "taker",             "type": "address"},
            {"indexed": False, "name": "makerAssetId",      "type": "uint256"},
            {"indexed": False, "name": "takerAssetId",      "type": "uint256"},
            {"indexed": False, "name": "makerAmountFilled", "type": "uint256"},
            {"indexed": False, "name": "takerAmountFilled", "type": "uint256"},
            {"indexed": False, "name": "fee",               "type": "uint256"},
        ],
        "name": "OrderFilled",
        "type": "event",
    }
]

# USDC on Polygon has 6 decimals
USDC_DECIMALS = 1_000_000


def _pad_address(address: str) -> str:
    """Pad a 20-byte address to a 32-byte log topic (left-pad with zeros)."""
    return "0x" + address.lower().replace("0x", "").zfill(64)


def _decode_log(w3: AsyncWeb3, raw_log: dict, contract_abi: list) -> dict | None:
    """
    Decode a raw eth_subscribe log into a structured OrderFilled event.
    Returns None if decoding fails.
    """
    try:
        contract = w3.eth.contract(
            address=w3.to_checksum_address(raw_log["address"]),
            abi=contract_abi,
        )
        event = contract.events.OrderFilled()
        decoded = event.process_log(raw_log)
        return decoded
    except Exception as exc:
        logger.debug("Could not decode log: %s", exc)
        return None


def _event_to_trade(decoded_event: dict, target_address: str) -> dict | None:
    """
    Convert a decoded OrderFilled event into the trade dict format
    expected by executor.copy_trade().

    Returns None if the target address is not involved in this trade.
    """
    args = decoded_event["args"]
    maker = args["maker"].lower()
    taker = args["taker"].lower()
    target = target_address.lower()

    if maker != target and taker != target:
        return None  # trade doesn't involve our target

    # Determine the outcome token being traded and the direction.
    # In Polymarket's CTFExchange:
    #   - makerAssetId == 0  → maker is selling USDC to buy shares (BUY from maker's POV)
    #   - makerAssetId != 0  → maker is selling shares to receive USDC (SELL from maker's POV)
    maker_asset = args["makerAssetId"]
    maker_amount = args["makerAmountFilled"]
    taker_asset = args["takerAssetId"]
    taker_amount = args["takerAmountFilled"]

    if maker == target:
        if maker_asset == 0:
            # Maker spent USDC to buy shares
            side = "BUY"
            token_id = str(taker_asset)
            usdc_amount = maker_amount / USDC_DECIMALS
            shares = taker_amount / USDC_DECIMALS
        else:
            # Maker sold shares to receive USDC
            side = "SELL"
            token_id = str(maker_asset)
            usdc_amount = taker_amount / USDC_DECIMALS
            shares = maker_amount / USDC_DECIMALS
    else:
        # target is taker — mirror the direction
        if taker_asset == 0:
            side = "BUY"
            token_id = str(maker_asset)
            usdc_amount = taker_amount / USDC_DECIMALS
            shares = maker_amount / USDC_DECIMALS
        else:
            side = "SELL"
            token_id = str(taker_asset)
            usdc_amount = maker_amount / USDC_DECIMALS
            shares = taker_amount / USDC_DECIMALS

    price = round(usdc_amount / shares, 6) if shares > 0 else 0

    return {
        "transactionHash": decoded_event["transactionHash"].hex(),
        "asset":           token_id,
        "side":            side,
        "price":           price,
        "usdcSize":        round(usdc_amount, 6),
        "size":            round(shares, 6),
        "_source":         "blockchain",
    }


class BlockchainMonitor:
    """
    Subscribes to Polygon log events and yields trades from the target address
    in near real-time (~2-5 second latency).

    Usage::

        monitor = BlockchainMonitor(target_address="0x...")
        async for trade in monitor.stream():
            print("New trade:", trade)
    """

    def __init__(self, target_address: str, ws_url: str):
        self.target_address = target_address.lower()
        self.ws_url = ws_url

    async def stream(self) -> AsyncGenerator[dict, None]:
        """Async generator that yields new trades as blockchain events arrive."""
        while True:  # reconnect loop
            try:
                async for trade in self._connect_and_stream():
                    yield trade
            except Exception as exc:
                logger.warning(
                    "WebSocket connection lost: %s — reconnecting in 5s...", exc
                )
                await asyncio.sleep(5)

    async def _connect_and_stream(self) -> AsyncGenerator[dict, None]:
        logger.info("Connecting to Polygon WebSocket: %s", self.ws_url)
        async with AsyncWeb3(WebSocketProvider(self.ws_url)) as w3:
            logger.info("Connected. Subscribing to OrderFilled events...")

            # We subscribe to all OrderFilled events from both exchange contracts,
            # then filter in Python. This is simpler than two subscriptions.
            # The topic0 is the keccak256 hash of the event signature.
            order_filled_topic = w3.keccak(
                text="OrderFilled(bytes32,address,address,uint256,uint256,uint256,uint256,uint256)"
            ).hex()

            # Subscribe to logs matching our event from either exchange contract
            sub_id = await w3.eth.subscribe(
                "logs",
                {
                    "address": EXCHANGE_ADDRESSES,
                    "topics": [order_filled_topic],
                },
            )
            logger.info(
                "Subscribed (id=%s). Watching for trades by %s...",
                sub_id,
                self.target_address,
            )

            async for message in w3.socket.process_subscriptions():
                raw_log = message["result"] if "result" in message else message
                decoded = _decode_log(w3, raw_log, ORDER_FILLED_ABI)
                if decoded is None:
                    continue
                trade = _event_to_trade(decoded, self.target_address)
                if trade is not None:
                    logger.info(
                        "On-chain trade detected in tx %s",
                        trade["transactionHash"][:18] + "...",
                    )
                    yield trade


def run_stream(target_address: str, ws_url: str, on_trade_callback) -> None:
    """
    Synchronous entry point: runs the async stream and calls *on_trade_callback*
    with each new trade dict. Blocks forever (until Ctrl+C).
    """
    async def _run():
        monitor = BlockchainMonitor(target_address, ws_url)
        async for trade in monitor.stream():
            on_trade_callback(trade)

    asyncio.run(_run())
