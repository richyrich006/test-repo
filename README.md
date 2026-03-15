# Polymarket Trade Copier

Automatically mirrors trades from a target Polymarket trader onto your own account.

## How it works

1. Every 30 seconds (configurable), it checks the target trader's recent activity via the Polymarket API.
2. Any new trade detected is scaled by your chosen fraction and placed as a market order on your account.
3. It runs until you stop it with `Ctrl+C`.

---

## Setup (step-by-step, no technical experience needed)

### Step 1 — Install Python

Download and install **Python 3.11+** from [python.org](https://python.org/downloads).
During installation, tick the box that says **"Add Python to PATH"**.

---

### Step 2 — Download this project

Click the green **Code** button on GitHub → **Download ZIP** → unzip it somewhere convenient (e.g. your Desktop).

---

### Step 3 — Open a terminal in the project folder

- **Windows**: hold Shift and right-click the folder → "Open PowerShell window here"
- **Mac**: right-click the folder → "New Terminal at Folder"

---

### Step 4 — Install dependencies

Paste this into the terminal and press Enter:

```
pip install -r requirements.txt
```

Wait for it to finish.

---

### Step 5 — Create your configuration file

Copy `.env.example` to a new file called `.env` (same folder).
Open `.env` in Notepad (or any text editor) and fill in:

| Setting | What to put |
|---|---|
| `TARGET_ADDRESS` | RN1's wallet address (see below) |
| `PRIVATE_KEY` | Your Polygon wallet private key |
| `COPY_FRACTION` | e.g. `0.1` = copy 10% of each trade size |
| `MAX_TRADE_SIZE_USDC` | Safety cap, e.g. `50` means never spend more than $50 per trade |

#### How to find RN1's wallet address

1. Go to [polymarket.com](https://polymarket.com) and search for **RN1**.
2. Open their profile page.
3. The URL or profile page will show their wallet address (starts with `0x`).
4. Paste that address as `TARGET_ADDRESS` in your `.env`.

#### Your private key

Your private key lives in your crypto wallet:
- **MetaMask**: Settings → Security & Privacy → Reveal Secret Recovery Phrase (use the private key for your specific account, not the seed phrase).
- Make sure this wallet has **USDC on Polygon** to fund your trades.

> ⚠️ **NEVER share your private key with anyone.** Treat it like a bank password.

---

### Step 6 — Test with a dry run (recommended first)

This shows you what trades it would copy **without spending any money**:

```
python copier.py --username RN1 --dry-run
```

You should see output like:
```
10:32:15 [INFO] Monitoring 0xabc...123 — polling every 30s
10:32:47 [INFO] NEW TRADE DETECTED | market: Will Liverpool FC win... | side: BUY | price: 0.03 | amount: $7.28
10:32:47 [INFO]   [DRY RUN] Would copy this trade — skipping execution.
```

---

### Step 7 — Run for real

```
python copier.py --username RN1
```

Or, if you already put RN1's address in `.env`:

```
python copier.py
```

Press **Ctrl+C** to stop.

---

## Important notes & risks

- **This is not financial advice.** Copying a profitable trader does not guarantee you will be profitable.
- **You will always be slightly behind** — the copy fires after the API detects the trade, which can be 30–90 seconds after RN1 places it. Prices may move in that time.
- **Start small.** Use `COPY_FRACTION=0.05` and a low `MAX_TRADE_SIZE_USDC` until you are comfortable.
- **Keep your `.env` file secret.** It contains your private key. Never upload it to GitHub.
- Make sure your wallet has enough USDC on **Polygon** (not Ethereum mainnet) to cover trades + gas fees.

---

## Files

| File | Purpose |
|---|---|
| `copier.py` | Main script — run this |
| `monitor.py` | Polls Polymarket for new trades |
| `executor.py` | Places copied trades via py-clob-client |
| `config.py` | Loads settings from `.env` |
| `.env.example` | Template for your configuration |
| `requirements.txt` | Python dependencies |
