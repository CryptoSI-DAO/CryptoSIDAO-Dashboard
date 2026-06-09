import {
  type ProposalWithVotes,
  getProposalStatus,
  formatTimestamp,
  getTimeRemaining,
  shortenAddress,
  getArbiscanUrl,
} from "@/lib/proposals";
import Link from "next/link";

interface ProposalCardProps {
  proposal: ProposalWithVotes;
}

export function ProposalCard({ proposal }: ProposalCardProps) {
  const statusColors: Record<string, string> = {
    Active: "bg-success/20 text-success border-success/30",
    Pending: "bg-warning/20 text-warning border-warning/30",
    Executed: "bg-accent-purple/20 text-accent-purple border-accent-purple/30",
    Closed: "bg-text-secondary/20 text-text-secondary border-text-secondary/30",
  };

  return (
    <div className="bg-bg-card rounded-xl border border-border p-5 hover:border-accent-purple/30 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <Link
          href={`/proposals/${proposal.id}`}
          className="text-text-primary font-semibold hover:text-accent-purple transition-colors"
        >
          Proposal #{proposal.id}
        </Link>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            statusColors[getProposalStatus(proposal)]
          }`}
        >
          {getProposalStatus(proposal)}
        </span>
      </div>

      <div className="text-sm text-text-secondary mb-3">
        Creator:{" "}
        <a
          href={getArbiscanUrl("address", proposal.creator)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-purple hover:text-accent-pink font-mono"
        >
          {shortenAddress(proposal.creator)}
        </a>
      </div>

      {/* Vote bar */}
      <div className="flex h-2 rounded-full overflow-hidden mb-2">
        {proposal.yesPercent > 0 && (
          <div
            className="vote-bar-yes transition-all"
            style={{ width: `${proposal.yesPercent}%` }}
          />
        )}
        {proposal.abstainPercent > 0 && (
          <div
            className="vote-bar-abstain transition-all"
            style={{ width: `${proposal.abstainPercent}%` }}
          />
        )}
        {proposal.noPercent > 0 && (
          <div
            className="vote-bar-no transition-all"
            style={{ width: `${proposal.noPercent}%` }}
          />
        )}
      </div>

      <div className="flex justify-between text-xs text-text-secondary mb-3">
        <span className="text-success">For: {proposal.yesPercent.toFixed(1)}%</span>
        <span className="text-text-secondary">Abstain: {proposal.abstainPercent.toFixed(1)}%</span>
        <span className="text-danger">Against: {proposal.noPercent.toFixed(1)}%</span>
      </div>

      <div className="flex justify-between text-xs text-text-secondary">
        <span>
          {proposal.status === "active"
            ? getTimeRemaining(proposal.votingEnd)
            : proposal.status === "pending"
            ? `Starts: ${formatTimestamp(proposal.votingStart)}`
            : `Ended: ${formatTimestamp(proposal.votingEnd)}`}
        </span>
        <Link
          href={`/proposals/${proposal.id}`}
          className="text-accent-purple hover:text-accent-pink font-medium"
        >
          View Details &rarr;
        </Link>
      </div>
    </div>
  );
}
