"use client";

import { useState, useEffect } from "react";
import { getDaoMetadata, type DaoMetadata } from "@/lib/ipfs";
import {
  getAllProposals,
  enrichProposal,
  getProposalCount,
  type ProposalWithVotes,
} from "@/lib/proposals";
import { getTokenInfo, type TokenInfo } from "@/lib/token";
import { ProposalCard } from "@/components/ProposalCard";

export default function DashboardPage() {
  const [metadata, setMetadata] = useState<DaoMetadata | null>(null);
  const [proposalCount, setProposalCount] = useState<number>(0);
  const [proposals, setProposals] = useState<ProposalWithVotes[]>([]);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDaoMetadata().catch(() => null),
      getProposalCount().catch(() => BigInt(0)),
      getAllProposals().catch(() => [] as ProposalWithVotes[]),
      getTokenInfo().catch(() => null),
    ]).then(([m, c, p, t]) => {
      setMetadata(m);
      setProposalCount(Number(c));
      setProposals(p.map(enrichProposal));
      setTokenInfo(t);
      setLoading(false);
    });
  }, []);

  const activeProposals = proposals.filter(
    (p) => p.status === "active" || p.status === "pending"
  );
  const recentProposals = proposals.slice(0, 6);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-bg-card rounded-xl border border-border p-6 h-32 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-bg-card rounded-xl border border-border p-5 h-24 animate-pulse" />
          <div className="bg-bg-card rounded-xl border border-border p-5 h-24 animate-pulse" />
          <div className="bg-bg-card rounded-xl border border-border p-5 h-24 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* DAO Header */}
      <div className="bg-bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-4 mb-4">
          {metadata?.avatar && (
            <img
              src={metadata.avatar.replace("ipfs://", "https://ipfs.io/ipfs/")}
              alt={metadata.name}
              className="w-16 h-16 rounded-xl"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {metadata?.name || "CryptoSI DAO"}
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              {metadata?.description?.slice(0, 150)}
              {metadata?.description && metadata.description.length > 150
                ? "..."
                : ""}
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
                className="px-3 py-1 bg-bg-secondary rounded-lg text-xs text-text-secondary hover:text-accent-purple transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-text-secondary mb-1">Total Proposals</p>
          <p className="text-3xl font-bold text-text-primary">
            {proposalCount.toLocaleString()}
          </p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-text-secondary mb-1">Active Proposals</p>
          <p className="text-3xl font-bold text-accent-purple">
            {activeProposals.length}
          </p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-text-secondary mb-1">Token Supply</p>
          <p className="text-3xl font-bold text-text-primary">
            {tokenInfo
              ? `${tokenInfo.totalSupplyFormatted} ${tokenInfo.symbol}`
              : "—"}
          </p>
        </div>
      </div>

      {/* Active Proposals */}
      {activeProposals.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-primary">Active Proposals</h2>
            <a
              href="/proposals"
              className="text-sm text-accent-purple hover:text-accent-pink transition-colors"
            >
              View All &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeProposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Proposals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text-primary">
            {activeProposals.length > 0 ? "Recent Proposals" : "All Proposals"}
          </h2>
          <a
            href="/proposals"
            className="text-sm text-accent-purple hover:text-accent-pink transition-colors"
          >
            View All &rarr;
          </a>
        </div>

        {recentProposals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentProposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>
        ) : (
          <div className="bg-bg-card rounded-xl border border-border p-12 text-center">
            <p className="text-text-secondary mb-2">No proposals yet</p>
            <p className="text-sm text-text-secondary/60">
              Proposals will appear here once they are created on-chain.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
