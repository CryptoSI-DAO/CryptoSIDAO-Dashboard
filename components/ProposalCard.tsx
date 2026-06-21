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

  const proposalLabel = `0x${proposal.id.slice(0, 6)}...${proposal.id.slice(-4)}`;

  return (
    <div className="bg-bg-card rounded-xl border border-border p-4 md:p-5 hover:border-accent-purple/30 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2 md:mb-3">
        <Link
          href={`/proposals/${proposal.id}`}
          className="text-text-primary font-semibold hover:text-accent-purple transition-colors text-sm md:text-base font-mono truncate"
        >
          {proposalLabel}
        </Link>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium border flex-shrink-0 ${
            statusColors[getProposalStatus(proposal)]
          }`}
        >
          {getProposalStatus(proposal)}
        </span>
      </div>

      <div className="text-xs text-text-secondary mb-2 md:mb-3 truncate">
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
      <div className="flex h-1.5 md:h-2 rounded-full overflow-hidden mb-1.5 md:mb-2">
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

      <div className="flex justify-between text-[10px] md:text-xs text-text-secondary mb-2 md:mb-3">
        <span className="text-success">For: {proposal.yesPercent.toFixed(1)}%</span>
        <span className="text-text-secondary hidden sm:inline">Abstain: {proposal.abstainPercent.toFixed(1)}%</span>
        <span className="text-danger">Against: {proposal.noPercent.toFixed(1)}%</span>
      </div>

      <div className="flex justify-between text-[10px] md:text-xs text-text-secondary">
        <span className="truncate">
          {proposal.status === "active"
            ? getTimeRemaining(proposal.parameters.endDate)
            : proposal.status === "pending"
            ? `Starts: ${formatTimestamp(proposal.parameters.startDate)}`
            : `Ended: ${formatTimestamp(proposal.parameters.endDate)}`}
        </span>
        <Link
          href={`/proposals/${proposal.id}`}
          className="text-accent-purple hover:text-accent-pink font-medium flex-shrink-0 ml-2"
        >
          View Details &rarr;
        </Link>
      </div>
    </div>
  );
}
