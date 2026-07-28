import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Nox Private Swap",
  description:
    "Privacy-preserving token swaps on Ethereum Sepolia. Route through Nox confidential handles, settle on Uniswap.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-nox-border py-6 text-center text-sm text-nox-muted">
              <p>
                Nox Private Swap · Ethereum Sepolia · Uniswap V2 (unmodified) ·
                Nox confidential layer
              </p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
