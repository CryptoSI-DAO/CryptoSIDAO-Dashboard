"use client";

import { useState, useEffect } from "react";
import { getDaoMetadata, getAllProposals, getMembers, getAssets, type DaoMetadata, type Proposal, type Member, type Asset } from "@/lib/dao";
import { ProposalCard } from "@/components/ProposalCard";

export default function DashboardPage() {
  const [metadata, setMetadata] = useState<DaoMetadata | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDaoMetadata().catch(() => null),
      getAllProposals().catch(() => []),
      getMembers().catch(() => []),
      getAssets().catch(() => []),
    ]).then(([m, p, mem, a]) => {
      setMetadata(m);
      setProposals(p);
      setMembers(mem);
      setAssets(a);
      setLoading(false);
    });
  }, []);

  const activeProposals = proposals.filter(
    (p) => p.status === "active" || p.status === "pending"
  );
  const recentProposals = proposals.slice(0, 4);

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
          <p className="text-2xl md:text-3xl font-bold text-text-primary">{proposals.length}</p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border p-4 md:p-5">
          <p className="text-xs text-text-secondary mb-1">Active</p>
          <p className="text-2xl md:text-3xl font-bold text-accent-purple">{activeProposals.length}</p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border p-4 md:p-5">
          <p className="text-xs text-text-secondary mb-1">Members</p>
          <p className="text-2xl md:text-3xl font-bold text-text-primary">{members.length}</p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border p-4 md:p-5">
          <p className="text-xs text-text-secondary mb-1">Assets</p>
          <p className="text-2xl md:text-3xl font-bold text-text-primary">{assets.length}</p>
        </div>
      </div>

      {/* Recent Proposals */}
      {recentProposals.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-lg md:text-xl font-bold text-text-primary">Recent Proposals</h2>
            <a href="/proposals" className="text-xs md:text-sm text-accent-purple hover:text-accent-pink transition-colors">
              View All &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {recentProposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>
        </div>
      )}

      {/* Top Members */}
      {members.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-lg md:text-xl font-bold text-text-primary">Top Members</h2>
            <a href="/members" className="text-xs md:text-sm text-accent-purple hover:text-accent-pink transition-colors">
              View All &rarr;
            </a>
          </div>
          <div className="bg-bg-card rounded-xl border border-border divide-y divide-border/50">
            {members.slice(0, 5).map((member, index) => (
              <div key={member.address} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-secondary font-mono w-5">#{index + 1}</span>
                  <span className="text-sm text-text-primary font-mono">
                    {member.address.slice(0, 6)}...{member.address.slice(-4)}
                  </span>
                </div>
                <span className="text-sm text-text-secondary font-mono">{member.balance} CRDD</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assets Preview */}
      {assets.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-lg md:text-xl font-bold text-text-primary">Treasury</h2>
            <a href="/assets" className="text-xs md:text-sm text-accent-purple hover:text-accent-pink transition-colors">
              View All &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {assets.slice(0, 4).map((asset, index) => (
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
    </div>
  );
}
