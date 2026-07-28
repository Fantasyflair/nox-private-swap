import { sepolia } from "viem/chains";
import { http, createConfig } from "wagmi";
import { injected, metaMask } from "wagmi/connectors";

export const SEPOLIA_CHAIN_ID = 11155111;

export const ADDRESSES = {
  UNISWAP_V2_ROUTER: "0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3" as const,
  PRIVATE_SWAP_ROUTER: "0x0000000000000000000000000000000000000000" as const,
  WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9" as const,
} as const;

export const TOKENS = [
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: ADDRESSES.WETH,
    decimals: 18,
    logo: "/tokens/weth.svg",
  },
] as const;

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [injected(), metaMask()],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://rpc.sepolia.org"),
  },
  ssr: true,
});

export const EXPLORER = "https://sepolia.etherscan.io";
