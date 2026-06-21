import { type Proposal, shortenAddress, getArbiscanUrl } from "@/lib/dao";
import Link from "next/link";

interface ProposalCardProps {
  proposal: Proposal;
}

export function ProposalCard({ proposal }: ProposalCardProps) {
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
            statusColors[statusLabel] || statusColors.Unknown
          }`}
        >
          {statusLabel}
        </span>
      </div>

      {proposal.metadata?.name && (
        <p className="text-sm text-text-primary mb-2 line-clamp-1">{proposal.metadata.name}</p>
      )}

      {proposal.metadata?.description && (
        <p className="text-xs text-text-secondary mb-3 line-clamp-2">{proposal.metadata.description}</p>
      )}

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

      {proposal.tally.yes > 0n || proposal.tally.no > 0n ? (
        <>
          <div className="flex h-1.5 md:h-2 rounded-full overflow-hidden mb-1.5 md:mb-2">
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
          <div className="flex justify-between text-[10px] md:text-xs text-text-secondary">
            <span className="text-success">For: {yesPercent(proposal).toFixed(1)}%</span>
            <span>Abstain: {abstainPercent(proposal).toFixed(1)}%</span>
            <span className="text-danger">Against: {noPercent(proposal).toFixed(1)}%</span>
          </div>
        </>
      ) : (
        <div className="text-xs text-text-secondary py-1">
          {proposal.metadataUri ? "Metadata available • " : ""}
          {proposal.actions.length > 0 ? `${proposal.actions.length} action(s)` : "No on-chain data"}
        </div>
      )}

      <div className="flex justify-between text-[10px] md:text-xs text-text-secondary mt-2">
        <span className="truncate">
          Block #{proposal.blockNumber.toLocaleString()}
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
