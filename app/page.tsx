"use client";

import { useState, useEffect } from "react";
import { getDaoMetadata, getAssets, type DaoMetadata, type Asset } from "@/lib/dao";

export default function DashboardPage() {
  const [metadata, setMetadata] = useState<DaoMetadata | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDaoMetadata().catch(() => null),
      getAssets().catch(() => []),
    ]).then(([m, a]) => {
      setMetadata(m);
      setAssets(a);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 md:space-y-8">
        <div className="bg-bg-card rounded-xl border border-border p-4 md:p-6 h-28 md:h-32 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-bg-card rounded-xl border border-border p-4 md:p-5 h-20 md:h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* DAO Header */}
      <div className="bg-bg-card rounded-xl border border-border p-4 md:p-6">
        <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
          {metadata?.avatar && (
            <img
              src={metadata.avatar.replace("ipfs://", "https://ipfs.io/ipfs/")}
              alt={metadata.name}
              className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex-shrink-0 object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-text-primary truncate">
              {metadata?.name || "CryptoSI DAO"}
            </h1>
            <p className="text-xs md:text-sm text-text-secondary mt-1 line-clamp-2">
              {metadata?.description?.slice(0, 200)}
              {metadata?.description && metadata.description.length > 200 ? "..." : ""}
            </p>
          </div>
        </div>

        {metadata?.links && metadata.links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {metadata.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-bg-secondary rounded-lg text-xs text-text-secondary hover:text-accent-purple transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-bg-card rounded-xl border border-border p-4 md:p-5">
          <p className="text-xs text-text-secondary mb-1">Proposals</p>
          <p className="text-2xl md:text-3xl font-bold text-text-primary">—</p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border p-4 md:p-5">
          <p className="text-xs text-text-secondary mb-1">Members</p>
          <p className="text-2xl md:text-3xl font-bold text-text-primary">—</p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border p-4 md:p-5">
          <p className="text-xs text-text-secondary mb-1">Assets</p>
          <p className="text-2xl md:text-3xl font-bold text-text-primary">{assets.length}</p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border p-4 md:p-5">
          <p className="text-xs text-text-secondary mb-1">Network</p>
          <p className="text-lg md:text-2xl font-bold text-accent-purple">Arbitrum</p>
        </div>
      </div>

      {/* Treasury Assets */}
      {assets.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-lg md:text-xl font-bold text-text-primary">Treasury</h2>
            <a href="/assets" className="text-xs md:text-sm text-accent-purple hover:text-accent-pink transition-colors">
              View All &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {assets.map((asset, index) => (
              <div key={`${asset.address}-${index}`} className="bg-bg-card rounded-xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {asset.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm text-text-primary font-medium">{asset.symbol}</p>
                    <p className="text-xs text-text-secondary">{asset.balance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coming Soon Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <a href="/proposals" className="bg-bg-card rounded-xl border border-border p-4 md:p-5 hover:border-accent-purple/30 transition-colors group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-text-primary group-hover:text-accent-purple transition-colors">Proposals</h3>
              <p className="text-xs text-text-secondary mt-1">Functionality coming soon</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary group-hover:text-accent-purple transition-colors">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </a>

        <a href="/members" className="bg-bg-card rounded-xl border border-border p-4 md:p-5 hover:border-accent-purple/30 transition-colors group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-text-primary group-hover:text-accent-purple transition-colors">Members</h3>
              <p className="text-xs text-text-secondary mt-1">Functionality coming soon</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary group-hover:text-accent-purple transition-colors">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </a>
      </div>
    </div>
  );
}
