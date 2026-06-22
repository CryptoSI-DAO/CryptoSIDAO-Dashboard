"use client";

import { useState, useEffect } from "react";
import { getAssets, shortenAddress, getArbiscanUrl, type Asset } from "@/lib/dao";

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssets()
      .then(setAssets)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-text-primary">Treasury Assets</h1>
        <p className="text-xs md:text-sm text-text-secondary mt-1">
          Assets held by the CryptoSI DAO treasury
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-bg-card rounded-xl border border-border p-5 h-24 animate-pulse" />
          ))}
        </div>
      ) : assets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {assets.map((asset, index) => (
            <div
              key={`${asset.address}-${index}`}
              className="bg-bg-card rounded-xl border border-border p-4 md:p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {asset.symbol.slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-text-primary font-semibold text-sm truncate">{asset.name}</h3>
                  <p className="text-text-secondary text-xs">{asset.symbol}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-secondary">Balance</span>
                  <span className="text-sm text-text-primary font-mono font-medium">
                    {asset.balance}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-secondary">Contract</span>
                  <a
                    href={getArbiscanUrl("address", asset.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-purple hover:text-accent-pink font-mono text-xs"
                  >
                    {shortenAddress(asset.address)}
                  </a>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-secondary">Decimals</span>
                  <span className="text-xs text-text-secondary">{asset.decimals}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-bg-card rounded-xl border border-border p-8 md:p-12 text-center">
          <p className="text-text-secondary mb-2">No assets found</p>
          <p className="text-xs md:text-sm text-text-secondary/60">
            Treasury assets will appear here once the DAO holds tokens or ETH.
          </p>
        </div>
      )}

      <div className="bg-bg-card rounded-xl border border-border p-4 md:p-6">
        <h3 className="text-base font-bold text-text-primary mb-3">Treasury Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-bg-secondary rounded-lg p-4">
            <p className="text-xs text-text-secondary mb-1">DAO Address</p>
            <a
              href={getArbiscanUrl("address", "0xA736319152057f9c3beb556EeE76Ea56598FFa13")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-purple hover:text-accent-pink font-mono text-sm"
            >
              0xA736...Fa13
            </a>
          </div>
          <div className="bg-bg-secondary rounded-lg p-4">
            <p className="text-xs text-text-secondary mb-1">Network</p>
            <p className="text-sm text-text-primary font-medium">Arbitrum One</p>
          </div>
        </div>
      </div>
    </div>
  );
}
