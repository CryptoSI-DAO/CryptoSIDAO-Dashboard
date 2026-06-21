"use client";

import { useState, useEffect } from "react";
import {
  getAllProposals,
  fetchProposalMetadata,
  shortenAddress,
  getArbiscanUrl,
  type Proposal,
  type ProposalMetadata,
} from "@/lib/dao";

function ProposalDetail({ proposal, onClose }: { proposal: Proposal & { metadata?: ProposalMetadata }; onClose: () => void }) {
  const statusColors: Record<string, string> = {
    active: "bg-success/20 text-success",
    pending: "bg-warning/20 text-warning",
    executed: "bg-accent-purple/20 text-accent-purple",
    defeated: "bg-text-secondary/20 text-text-secondary",
    unknown: "bg-text-secondary/10 text-text-secondary",
  };

  const proposalLabel = `0x${proposal.id.slice(0, 10)}...${proposal.id.slice(-6)}`;

  return (
    <div className="space-y-4 md:space-y-6">
      <button
        onClick={onClose}
        className="text-sm text-accent-purple hover:text-accent-pink flex items-center gap-1"
      >
        &larr; Back to proposals
      </button>

      <div className="bg-bg-card rounded-xl border border-border p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-xs md:text-sm text-text-secondary mb-1">Proposal</p>
            <h1 className="text-lg md:text-2xl font-bold text-text-primary font-mono break-all">
              {proposalLabel}
            </h1>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium self-start ${statusColors[proposal.status]}`}
          >
            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
          </span>
        </div>

        {proposal.metadata?.name && (
          <h2 className="text-lg font-semibold text-text-primary mb-2">{proposal.metadata.name}</h2>
        )}

        {proposal.metadata?.description && (
          <div className="bg-bg-secondary rounded-lg p-4 mb-4">
            <p className="text-sm text-text-secondary whitespace-pre-wrap">
              {proposal.metadata.description.slice(0, 1000)}
              {proposal.metadata.description.length > 1000 ? "..." : ""}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 text-sm">
          <div>
            <p className="text-text-secondary">Creator</p>
            <a
              href={getArbiscanUrl("address", proposal.creator)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-purple hover:text-accent-pink font-mono text-xs md:text-sm break-all"
            >
              {shortenAddress(proposal.creator)}
            </a>
          </div>
          <div>
            <p className="text-text-secondary">Block</p>
            <p className="text-text-primary font-medium text-xs md:text-sm">
              #{proposal.blockNumber.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-text-secondary">Actions</p>
            <p className="text-text-primary font-medium text-xs md:text-sm">
              {proposal.actions.length}
            </p>
          </div>
        </div>
      </div>

      {/* Vote Results */}
      {(proposal.tally.yes > 0n || proposal.tally.no > 0n) && (
        <div className="bg-bg-card rounded-xl border border-border p-4 md:p-6">
          <h2 className="text-base md:text-lg font-bold text-text-primary mb-3 md:mb-4">Vote Results</h2>

          <div className="flex h-3 md:h-4 rounded-full overflow-hidden mb-3 md:mb-4">
            {Number(proposal.tally.yes) > 0 && (
              <div className="vote-bar-yes" style={{ width: `${yesPercent(proposal)}%` }} />
            )}
            {Number(proposal.tally.abstain) > 0 && (
              <div className="vote-bar-abstain" style={{ width: `${abstainPercent(proposal)}%` }} />
            )}
            {Number(proposal.tally.no) > 0 && (
              <div className="vote-bar-no" style={{ width: `${noPercent(proposal)}%` }} />
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <div className="bg-bg-secondary rounded-lg p-3 md:p-4 border border-success/20">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-success flex-shrink-0" />
                <span className="text-xs font-medium text-success">For</span>
              </div>
              <p className="text-lg font-bold text-text-primary">{yesPercent(proposal).toFixed(1)}%</p>
              <p className="text-[10px] text-text-secondary font-mono truncate">{proposal.tally.yes.toString()}</p>
            </div>
            <div className="bg-bg-secondary rounded-lg p-3 md:p-4 border border-text-secondary/20">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-text-secondary flex-shrink-0" />
                <span className="text-xs font-medium text-text-secondary">Abstain</span>
              </div>
              <p className="text-lg font-bold text-text-primary">{abstainPercent(proposal).toFixed(1)}%</p>
              <p className="text-[10px] text-text-secondary font-mono truncate">{proposal.tally.abstain.toString()}</p>
            </div>
            <div className="bg-bg-secondary rounded-lg p-3 md:p-4 border border-danger/20">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-danger flex-shrink-0" />
                <span className="text-xs font-medium text-danger">Against</span>
              </div>
              <p className="text-lg font-bold text-text-primary">{noPercent(proposal).toFixed(1)}%</p>
              <p className="text-[10px] text-text-secondary font-mono truncate">{proposal.tally.no.toString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {proposal.actions.length > 0 && (
        <div className="bg-bg-card rounded-xl border border-border p-4 md:p-6">
          <h2 className="text-base md:text-lg font-bold text-text-primary mb-3">
            Actions ({proposal.actions.length})
          </h2>
          <div className="space-y-3">
            {proposal.actions.map((action, i) => (
              <div key={i} className="bg-bg-secondary rounded-lg p-3 md:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-accent-purple bg-accent-purple/10 px-2 py-0.5 rounded">
                    #{i + 1}
                  </span>
                  <a
                    href={getArbiscanUrl("address", action.to)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-purple hover:text-accent-pink font-mono text-xs break-all"
                  >
                    {shortenAddress(action.to)}
                  </a>
                </div>
                {action.value > 0n && (
                  <p className="text-xs text-text-secondary mb-1">Value: {action.value.toString()} wei</p>
                )}
                {action.data && action.data !== "0x" && (
                  <div className="mt-2">
                    <p className="text-[10px] text-text-secondary mb-1">Calldata:</p>
                    <code className="text-[10px] text-text-secondary font-mono break-all block bg-bg-primary rounded p-2 max-h-24 overflow-y-auto">
                      {action.data.slice(0, 100)}{action.data.length > 100 ? "..." : ""}
                    </code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* On-Chain Info */}
      <div className="bg-bg-card rounded-xl border border-border p-4 md:p-6">
        <h2 className="text-base md:text-lg font-bold text-text-primary mb-3">On-Chain Info</h2>
        <div className="space-y-3 text-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-text-secondary">Proposal ID</span>
            <span className="text-text-primary font-mono text-xs break-all">{proposal.id}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-text-secondary">Transaction</span>
            <a
              href={getArbiscanUrl("tx", proposal.txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-purple hover:text-accent-pink font-mono text-xs break-all"
            >
              {proposal.txHash.slice(0, 10)}...{proposal.txHash.slice(-6)}
            </a>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-text-secondary">Network</span>
            <span className="text-text-primary text-xs md:text-sm">Arbitrum One</span>
          </div>
          {proposal.metadataUri && (
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
              <span className="text-text-secondary">Metadata</span>
              <a
                href={proposal.metadataUri.replace("ipfs://", "https://ipfs.io/ipfs/")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-purple hover:text-accent-pink text-xs break-all"
              >
                {proposal.metadataUri}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProposalRow({ proposal, onSelect }: { proposal: Proposal & { metadata?: ProposalMetadata }; onSelect: () => void }) {
  const statusColors: Record<string, string> = {
    Active: "bg-success/20 text-success border-success/30",
    Pending: "bg-warning/20 text-warning border-warning/30",
    Executed: "bg-accent-purple/20 text-accent-purple border-accent-purple/30",
    Closed: "bg-text-secondary/20 text-text-secondary border-text-secondary/30",
    Unknown: "bg-text-secondary/10 text-text-secondary border-text-secondary/20",
  };

  const statusLabel = proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1);
  const proposalLabel = `0x${proposal.id.slice(0, 8)}...${proposal.id.slice(-4)}`;

  return (
    <div
      className="bg-bg-card rounded-xl border border-border p-3 md:p-4 hover:border-accent-purple/30 transition-colors cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <span className="text-text-primary font-semibold text-sm md:text-base font-mono truncate block">
            {proposalLabel}
          </span>
          {proposal.metadata?.name && (
            <p className="text-xs text-text-secondary truncate mt-0.5">{proposal.metadata.name}</p>
          )}
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium border flex-shrink-0 ${statusColors[statusLabel] || statusColors.Unknown}`}>
          {statusLabel}
        </span>
      </div>

      <div className="text-[10px] md:text-xs text-text-secondary">
        Creator:{" "}
        <a
          href={getArbiscanUrl("address", proposal.creator)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-purple hover:text-accent-pink font-mono"
          onClick={(e) => e.stopPropagation()}
        >
          {shortenAddress(proposal.creator)}
        </a>
        <span className="mx-1 md:mx-2">&middot;</span>
        Block #{proposal.blockNumber.toLocaleString()}
      </div>
    </div>
  );
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<(Proposal & { metadata?: ProposalMetadata })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    getAllProposals()
      .then(async (proposals) => {
        // Fetch IPFS metadata for each proposal
        const withMetadata = await Promise.all(
          proposals.map(async (p) => {
            if (p.metadataUri) {
              const metadata = await fetchProposalMetadata(p.metadataUri);
              return { ...p, metadata };
            }
            return p;
          })
        );
        setProposals(withMetadata);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = proposals.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  const counts = {
    all: proposals.length,
    active: proposals.filter((p) => p.status === "active").length,
    pending: proposals.filter((p) => p.status === "pending").length,
    executed: proposals.filter((p) => p.status === "executed").length,
    defeated: proposals.filter((p) => p.status === "defeated").length,
    unknown: proposals.filter((p) => p.status === "unknown").length,
  };

  const selectedProposal = selectedId ? proposals.find((p) => p.id === selectedId) : null;

  if (selectedProposal) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-primary">Proposals</h1>
          <p className="text-xs md:text-sm text-text-secondary mt-1">{proposals.length} total proposals</p>
        </div>
        <ProposalDetail proposal={selectedProposal} onClose={() => setSelectedId(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-text-primary">Proposals</h1>
        <p className="text-xs md:text-sm text-text-secondary mt-1">{proposals.length} total proposals</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
        {(["all", "active", "pending", "executed", "defeated", "unknown"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              filter === f
                ? "bg-accent-purple text-white"
                : "bg-bg-card text-text-secondary hover:text-text-primary border border-border"
            }`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-bg-card rounded-xl border border-border p-8 md:p-12 text-center">
          <p className="text-text-secondary">Loading proposals...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((p) => (
            <ProposalRow key={p.id} proposal={p} onSelect={() => setSelectedId(p.id)} />
          ))}
        </div>
      ) : (
        <div className="bg-bg-card rounded-xl border border-border p-8 md:p-12 text-center">
          <p className="text-text-secondary mb-2">
            {filter === "all" ? "No proposals found" : "No proposals match this filter"}
          </p>
          <p className="text-xs md:text-sm text-text-secondary/60">
            Proposals will appear here once they are created on-chain.
          </p>
        </div>
      )}
    </div>
  );
}

function yesPercent(p: Proposal): number {
  const total = Number(p.tally.yes + p.tally.no + p.tally.abstain);
  return total > 0 ? (Number(p.tally.yes) / total) * 100 : 0;
}

function noPercent(p: Proposal): number {
  const total = Number(p.tally.yes + p.tally.no + p.tally.abstain);
  return total > 0 ? (Number(p.tally.no) / total) * 100 : 0;
}

function abstainPercent(p: Proposal): number {
  const total = Number(p.tally.yes + p.tally.no + p.tally.abstain);
  return total > 0 ? (Number(p.tally.abstain) / total) * 100 : 0;
}
