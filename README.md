# Nox Private Swap

Privacy-preserving token swaps on **Ethereum Sepolia**.

Users encrypt trade size with **Nox** (TEE-backed handles / ERC-7984 patterns), create an on-chain intent via `PrivateSwapRouter`, then settle against the **unmodified Uniswap V2 Router02**. Individual size stays confidential; the settlement path remains fully composable with public DeFi.

---

## Architecture

```
User wallet
    │
    ├─ encrypt amount  →  Nox Handle Gateway (Intel TDX)
    │                     returns handle + EIP-712 proof
    │
    ├─ createPrivateSwapIntent(handle, proof, minOut, deadline)
    │       → PrivateSwapRouter (this repo)
    │
    └─ settlePrivateSwap(intentId, amountIn, path)
            → calls Uniswap V2 Router02.swapExactTokensForTokens
              (no core Uniswap contracts modified)
```

**What stays private**
- Exact trade size (Nox `euint256` handle)
- Ability for third parties / explorers to read size while the intent is open

**What is public**
- Token pair, minOut, deadline
- That an intent was created by `msg.sender`
- Final `amountIn` / `amountOut` once settled against Uniswap
- The Uniswap path itself

---

## Repo structure

```
nox-private-swap/
├── contracts/
│   ├── src/PrivateSwapRouter.sol   # Integration layer
│   ├── script/Deploy.s.sol
│   └── foundry.toml
├── frontend/                       # Next.js 14 + wagmi + viem + Tailwind
│   ├── app/
│   ├── components/
│   └── lib/
├── .env.example
├── README.md
└── feedback.md
```

---

## Prerequisites

- Node.js 20+
- Foundry (`forge`, `cast`)
- A Sepolia-funded wallet (ETH for gas + test tokens with Uniswap V2 liquidity)
- Optional: Alchemy/Infura RPC, Etherscan API key for verification

---

## 1. Deploy the router

```bash
cd contracts
forge install foundry-rs/forge-std --no-commit   # if needed
cp ../.env.example .env                          # fill PRIVATE_KEY, SEPOLIA_RPC_URL, ETHERSCAN_API_KEY

forge script script/Deploy.s.sol:DeployPrivateSwap \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  -vvvv
```

Copy the printed `PrivateSwapRouter` address.

Uniswap V2 Router02 on Sepolia (official):  
`0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3`

---

## 2. Frontend

```bash
cd frontend
cp ../.env.example .env.local
# Set:
# NEXT_PUBLIC_PRIVATE_SWAP_ROUTER=<address from step 1>
# NEXT_PUBLIC_SEPOLIA_RPC_URL=...

npm install
npm run dev
```

Open http://localhost:3000. Connect MetaMask / Rabby on **Sepolia**.

For a public demo:

```bash
npm run build && npm start
# or deploy the frontend folder to Vercel
```

---

## 3. Nox integration (required for true confidentiality)

The contract and UI are structured for Nox handles. To go live:

1. Install `@iexec-nox/handle` and the Nox Solidity library (`@iexec-nox/nox-protocol-contracts` or equivalent).
2. Replace the stub `Nox` library in `PrivateSwapRouter.sol` with the real import.
3. In the frontend, before calling `createPrivateSwapIntent`:

```ts
import { createViemHandleClient } from "@iexec-nox/handle";

const handleClient = await createViemHandleClient(walletClient);
const { handle, handleProof } = await handleClient.encryptInput(
  amountInWei,
  "uint256",
  PRIVATE_SWAP_ROUTER_ADDRESS
);
// pass handle + handleProof into the contract call
```

4. Configure gateway / NoxCompute / subgraph URLs for the network you use (see Nox docs).

Until the gateway is wired, the UI will still submit transactions against your deployed router but the encryption step is a documented call site rather than a live TEE round-trip.

---

## Demo script (for judges / reviewers)

1. Switch wallet to **Ethereum Sepolia**.
2. Fund with Sepolia ETH + a token that has Uniswap V2 liquidity.
3. Open the app → Connect wallet.
4. Toggle **Private mode** on.
5. Enter amount → observe real balance + Uniswap quote.
6. Approve (if needed) → **Swap Privately**.
7. Confirm in wallet → wait for receipt.
8. Open **History** → intents are read from the live contract.
9. Open **Receipt** → privacy summary + explorer link.
10. On Etherscan, verify the router called the public Uniswap V2 router (no modified AMM code).

---

## Security / scope notes

- This is a **hackathon / testnet** project. Do not use on mainnet without audit.
- The Nox library inside the Solidity file is a **compile-time stub** so the repo builds offline. Replace it with the official library before any claim of production confidentiality.
- Relayer role exists for future batch settlement / selective disclosure flows.
- Always verify contract addresses and Uniswap liquidity before demoing.

---

## License

MIT
