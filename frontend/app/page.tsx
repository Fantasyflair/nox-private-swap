import { SwapForm } from "@/components/SwapForm";
import { PrivacyExplainer } from "@/components/PrivacyExplainer";
import { Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nox-accent/10 text-nox-accent text-xs font-medium mb-4">
          <Shield className="w-3.5 h-3.5" />
          Ethereum Sepolia · Nox × Uniswap
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
          Swap privately
        </h1>
        <p className="text-nox-muted max-w-lg mx-auto text-sm sm:text-base">
          Encrypt your trade size with Nox, settle against the public Uniswap V2
          router. Individual size stays hidden; the path stays composable.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        <SwapForm />
        <PrivacyExplainer />
      </div>
    </div>
  );
}
