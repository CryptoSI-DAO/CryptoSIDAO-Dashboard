"use client";

import { useState, useEffect } from "react";
import { getTokenInfo, type TokenInfo } from "@/lib/token";

export default function TokenPage() {
  const [token, setToken] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTokenInfo()
      .then(setToken)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="bg-bg-card rounded-xl border border-border p-4 md:p-6 h-28 md:h-32 animate-pulse" />
        <div className="bg-bg-card rounded-xl border border-border p-4 md:p-6 h-44 md:h-48 animate-pulse" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="bg-bg-card rounded-xl border border-border p-6 md:p-8 text-center">
        <p className="text-text-secondary">Unable to load token info</p>
        <p className="text-xs md:text-sm text-text-secondary/60 mt-1">
          The token contract could not be reached.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-text-primary">Token Info</h1>
        <p className="text-xs md:text-sm text-text-secondary mt-1">
          Governance token for CryptoSI DAO
        </p>
      </div>

      <div className="bg-bg-card rounded-xl border border-border p-4 md:p-6">
        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white font-bold text-lg md:text-xl flex-shrink-0">
            {token.symbol.charAt(0)}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-text-primary truncate">{token.name}</h2>
            <p className="text-text-secondary text-sm md:text-base">{token.symbol}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <InfoRow label="Symbol" value={token.symbol} />
          <InfoRow label="Decimals" value={token.decimals.toString()} />
          <InfoRow
            label="Total Supply"
            value={`${token.totalSupplyFormatted} ${token.symbol}`}
          />
          <InfoRow
            label="Contract"
            value={
              <a
                href={`https://arbiscan.io/address/${token.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-purple hover:text-accent-pink font-mono text-xs md:text-sm break-all"
              >
                {token.address.slice(0, 6)}...{token.address.slice(-4)}
              </a>
            }
          />
        </div>
      </div>

      <div className="bg-bg-card rounded-xl border border-border p-4 md:p-6">
        <h3 className="text-base md:text-lg font-bold text-text-primary mb-3 md:mb-4">
          Contract Details
        </h3>
        <div className="space-y-2 md:space-y-3">
          <InfoRow
            label="Token Address"
            value={<span className="font-mono text-xs md:text-sm break-all">{token.address}</span>}
          />
          <InfoRow
            label="DAO Address"
            value={
              <span className="font-mono text-xs md:text-sm break-all">
                0xA736319152057f9c3beb556EeE76Ea56598FFa13
              </span>
            }
          />
          <InfoRow label="Network" value="Arbitrum One (Chain ID: 42161)" />
          <InfoRow label="Standard" value="ERC-20" />
          <InfoRow label="Governance" value="Aragon OSx Token Voting" />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-2 border-b border-border/50 last:border-0">
      <span className="text-xs md:text-sm text-text-secondary flex-shrink-0">{label}</span>
      <span className="text-xs md:text-sm text-text-primary font-medium text-right break-all">{value}</span>
    </div>
  );
}
