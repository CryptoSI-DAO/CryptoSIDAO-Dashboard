"use client";

import { useState } from "react";
import {
  getAllProposals,
  enrichProposal,
  getProposal,
  getArbiscanUrl,
  shortenAddress,
  formatTimestamp,
  type ProposalWithVotes,
  type Proposal,
} from "@/lib/proposals";
import { useEffect } from "react";

function ProposalDetail({ proposal, onClose }: { proposal: ProposalWithVotes; onClose: () => void }) {
  const statusColors: Record<string, string> = {
    active: "bg-success/20 text-success",
    pending: "bg-warning/20 text-warning",
    executed: "bg-accent-purple/20 text-accent-purple",
    defeated: "bg-text-secondary/20 text-text-secondary",
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onClose}
        className="text-sm text-accent-purple hover:text-accent-pink"
      >
        &larr; Back to proposals
      </button>

      <div className="bg-bg-card rounded-xl border border-border p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-text-secondary mb-1">
              Proposal #{proposal.id}
            </p>
            <h1 className="text-2xl font-bold text-text-primary">
              Proposal #{proposal.id}
            </h1>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[proposal.status]}`}
          >
            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-text-secondary">Created by</p>
            <a
              href={getArbiscanUrl("address", proposal.creator)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-purple hover:text-accent-pink font-mono"
            >
              {shortenAddress(proposal.creator)}
            </a>
          </div>
          <div>
            <p className="text-text-secondary">Voting Start</p>
            <p className="text-text-primary font-medium">
              {formatTimestamp(proposal.votingStart)}
            </p>
          </div>
          <div>
            <p className="text-text-secondary">Voting End</p>
            <p className="text-text-primary font-medium">
              {formatTimestamp(proposal.votingEnd)}
            </p>
          </div>
          <div>
            <p className="text-text-secondary">Executed</p>
            <p className="text-text-primary font-medium">
              {proposal.executed ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-bold text-text-primary mb-4">Vote Results</h2>

        <div className="flex h-4 rounded-full overflow-hidden mb-4">
          {proposal.yesPercent > 0 && (
            <div className="vote-bar-yes" style={{ width: `${proposal.yesPercent}%` }} />
          )}
          {proposal.abstainPercent > 0 && (
            <div className="vote-bar-abstain" style={{ width: `${proposal.abstainPercent}%` }} />
          )}
          {proposal.noPercent > 0 && (
            <div className="vote-bar-no" style={{ width: `${proposal.noPercent}%` }} />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-bg-secondary rounded-lg p-4 border border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-sm font-medium text-success">For</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">
              {proposal.yesPercent.toFixed(1)}%
            </p>
            <p className="text-xs text-text-secondary font-mono">
              {proposal.tally.yes.toString()}
            </p>
          </div>
          <div className="bg-bg-secondary rounded-lg p-4 border border-text-secondary/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-text-secondary" />
              <span className="text-sm font-medium text-text-secondary">Abstain</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">
              {proposal.abstainPercent.toFixed(1)}%
            </p>
            <p className="text-xs text-text-secondary font-mono">
              {proposal.tally.abstain.toString()}
            </p>
          </div>
          <div className="bg-bg-secondary rounded-lg p-4 border border-danger/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-danger" />
              <span className="text-sm font-medium text-danger">Against</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">
              {proposal.noPercent.toFixed(1)}%
            </p>
            <p className="text-xs text-text-secondary font-mono">
              {proposal.tally.no.toString()}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Total votes cast</span>
            <span className="text-text-primary font-mono">{proposal.totalVotes.toString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-bold text-text-primary mb-4">On-Chain Info</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">DAO Address</span>
            <a
              href={getArbiscanUrl("address", "0xA736319152057f9c3beb556EeE76Ea56598FFa13")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-purple hover:text-accent-pink font-mono"
            >
              0xA736...Fa13
            </a>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Network</span>
            <span className="text-text-primary">Arbitrum One</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Governance Plugin</span>
            <a
              href={getArbiscanUrl("address", "0x1aed2beb470aefd65b43f905bd5371b1e4749d18")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-purple hover:text-accent-pink font-mono"
            >
              0x1aed...d18
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProposalRow({ proposal, onSelect }: { proposal: ProposalWithVotes; onSelect: () => void }) {
  const statusColors: Record<string, string> = {
    Active: "bg-success/20 text-success border-success/30",
    Pending: "bg-warning/20 text-warning border-warning/30",
    Executed: "bg-accent-purple/20 text-accent-purple border-accent-purple/30",
    Closed: "bg-text-secondary/20 text-text-secondary border-text-secondary/30",
  };

  const statusLabels: Record<string, string> = {
    active: "Active",
    pending: "Pending",
    executed: "Executed",
    defeated: "Closed",
  };

  return (
    <div
      className="bg-bg-card rounded-xl border border-border p-4 hover:border-accent-purple/30 transition-colors cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-text-primary font-semibold">Proposal #{proposal.id}</span>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[statusLabels[proposal.status]]}`}>
          {statusLabels[proposal.status]}
        </span>
      </div>

      <div className="text-xs text-text-secondary mb-3">
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
        <span className="mx-2">&middot;</span>
        {formatTimestamp(proposal.votingEnd)}
      </div>

      <div className="flex h-2 rounded-full overflow-hidden mb-2">
        {proposal.yesPercent > 0 && (
          <div className="vote-bar-yes" style={{ width: `${proposal.yesPercent}%` }} />
        )}
        {proposal.abstainPercent > 0 && (
          <div className="vote-bar-abstain" style={{ width: `${proposal.abstainPercent}%` }} />
        )}
        {proposal.noPercent > 0 && (
          <div className="vote-bar-no" style={{ width: `${proposal.noPercent}%` }} />
        )}
      </div>

      <div className="flex justify-between text-xs text-text-secondary">
        <span className="text-success">For: {proposal.yesPercent.toFixed(1)}%</span>
        <span>Abstain: {proposal.abstainPercent.toFixed(1)}%</span>
        <span className="text-danger">Against: {proposal.noPercent.toFixed(1)}%</span>
      </div>
    </div>
  );
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<ProposalWithVotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<ProposalWithVotes | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    getAllProposals()
      .then((p) => {
        setProposals(p.map(enrichProposal));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedId === null) {
      setSelectedProposal(null);
      return;
    }
    getProposal(selectedId)
      .then((p) => {
        if (p) setSelectedProposal(enrichProposal(p));
      })
      .catch(() => setSelectedProposal(null));
  }, [selectedId]);

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
  };

  if (selectedProposal) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Proposals</h1>
          <p className="text-sm text-text-secondary mt-1">{proposals.length} total proposals</p>
        </div>
        <ProposalDetail proposal={selectedProposal} onClose={() => setSelectedId(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Proposals</h1>
        <p className="text-sm text-text-secondary mt-1">
          {proposals.length} total proposals
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(["all", "active", "pending", "executed", "defeated"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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
        <div className="bg-bg-card rounded-xl border border-border p-12 text-center">
          <p className="text-text-secondary">Loading proposals...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((p) => (
            <ProposalRow key={p.id} proposal={p} onSelect={() => setSelectedId(p.id)} />
          ))}
        </div>
      ) : (
        <div className="bg-bg-card rounded-xl border border-border p-12 text-center">
          <p className="text-text-secondary mb-2">
            {filter === "all" ? "No proposals found" : "No proposals match this filter"}
          </p>
          <p className="text-sm text-text-secondary/60">
            Proposals will appear here once they are created on-chain.
          </p>
        </div>
      )}
    </div>
  );
}
