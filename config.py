"""
Configuration loader for the Polymarket Trade Copier.
Reads settings from environment variables / .env file.
"""

import os
from dotenv import load_dotenv

load_dotenv()


def _require(key: str) -> str:
    val = os.getenv(key)
    if not val:
        raise EnvironmentError(
            f"Missing required environment variable: {key}\n"
            f"Copy .env.example to .env and fill in your values."
        )
    return val


# Who to copy
TARGET_ADDRESS: str = _require("TARGET_ADDRESS").lower()

# Your wallet
PRIVATE_KEY: str = _require("PRIVATE_KEY")

# Trade sizing
COPY_FRACTION: float = float(os.getenv("COPY_FRACTION", "0.1"))
MAX_TRADE_SIZE_USDC: float = float(os.getenv("MAX_TRADE_SIZE_USDC", "50.0"))
MIN_TRADE_SIZE_USDC: float = float(os.getenv("MIN_TRADE_SIZE_USDC", "1.0"))

# Polling (used in poll mode only)
POLL_INTERVAL_SECONDS: int = int(os.getenv("POLL_INTERVAL_SECONDS", "10"))

# Live mode: Polygon WebSocket RPC URL
# Get a free one at https://dashboard.alchemy.com/ → create app → Polygon mainnet → WebSockets
# Example: wss://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
# Or use the free public node (less reliable): wss://polygon-bor-rpc.publicnode.com
WEB3_WS_URL: str = os.getenv("WEB3_WS_URL", "")

# API endpoints
CLOB_API_URL: str = os.getenv("CLOB_API_URL", "https://clob.polymarket.com")
GAMMA_API_URL: str = os.getenv("GAMMA_API_URL", "https://gamma-api.polymarket.com")
DATA_API_URL: str = os.getenv("DATA_API_URL", "https://data-api.polymarket.com")

# Chain
CHAIN_ID: int = int(os.getenv("CHAIN_ID", "137"))
