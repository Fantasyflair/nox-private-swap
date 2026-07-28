# feedback.md — Nox Private Swap

## What was built

- **PrivateSwapRouter** (Solidity): thin integration layer that
  - accepts Nox-style encrypted amount handles + proofs,
  - records private swap intents on-chain,
  - settles by calling the **unmodified** Uniswap V2 Router02 on Sepolia,
  - emits clear privacy events and keeps individual size as a handle until settlement.
- **Next.js frontend** (wagmi + viem + Tailwind):
  - real wallet connection (injected / MetaMask),
  - real ERC-20 balance and allowance reads,
  - real Uniswap `getAmountsOut` quotes,
  - private / public mode toggle,
  - privacy explanation UI (what is hidden vs public),
  - approve → execute flow with live tx hash + receipt page,
  - on-chain intent history for the connected address,
  - accessible, dark, minimal UI.
- Deploy script (Foundry), `.env.example`, README with exact addresses and demo steps.

## What works end-to-end on Sepolia (once you deploy)

1. Deploy router with Foundry → get address.
2. Set `NEXT_PUBLIC_PRIVATE_SWAP_ROUTER`.
3. Connect wallet on Sepolia → see real balances.
4. Get real quotes from Uniswap V2.
5. Approve + create intent / public swap → real transactions and receipts.
6. History page reads real intent data from the contract.

## What requires extra steps for full Nox confidentiality

- Replace the stub `Nox` library in the contract with the official `@iexec-nox` Solidity SDK.
- Wire `@iexec-nox/handle` in the frontend and call `encryptInput` before `createPrivateSwapIntent`.
- Confirm live Handle Gateway + NoxCompute addresses for **Ethereum Sepolia**.
- Choose token pairs that actually have Uniswap V2 liquidity on Sepolia.

## What could be improved next

1. Full Nox round-trip — live encrypt → fromExternal → optional publicDecrypt of aggregate → settle.
2. Batch / intent matching — accumulate encrypted sizes, settle only the sum.
3. More tokens & Uniswap V3.
4. Relayer + gas abstraction.
5. Selective disclosure UI.
6. Stronger error surface.
7. Verified ABIs + addresses committed after deploy.
8. Mobile polish.

## Scope decisions (intentional)

- Prefer a **working** Uniswap settlement path over a mocked privacy layer.
- Do **not** fork or modify Uniswap.
- Do **not** invent live Nox gateway URLs or fake balances.
- Contract compiles offline; Nox calls are structured for the real library drop-in.
- Frontend never simulates balances or tx results.

## Demo readiness checklist

- [ ] Router deployed + verified on Sepolia
- [ ] Frontend env points at deployed router + solid RPC
- [ ] At least one liquid token pair tested
- [ ] Nox SDK encrypt path enabled (or clearly labelled)
- [ ] README demo script followed once end-to-end
