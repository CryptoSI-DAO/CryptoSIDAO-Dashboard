import { publicClient, governancePluginContract, DAO_ADDRESS } from "./contracts";

export type VoteOption = "abstain" | "yes" | "no";

export interface ProposalTally {
  abstain: bigint;
  yes: bigint;
  no: bigint;
}

export interface Proposal {
  id: number;
  executed: boolean;
  votingStart: bigint;
  votingEnd: bigint;
  tally: ProposalTally;
  creator: string;
  status: "pending" | "active" | "executed" | "defeated";
  description?: string;
}

export interface ProposalWithVotes extends Proposal {
  totalVotes: bigint;
  yesPercent: number;
  noPercent: number;
  abstainPercent: number;
}

const ARBITRUM_BLOCK_TIME_SECONDS = 0.25; // ~250ms per block

export async function getProposalCount(): Promise<bigint> {
  return publicClient.readContract({
    ...governancePluginContract,
    functionName: "proposalCount",
  });
}

export async function getProposal(id: number): Promise<Proposal | null> {
  try {
    const result = await publicClient.readContract({
      ...governancePluginContract,
      functionName: "getProposal",
      args: [BigInt(id)],
    });

    const [executed, parameters, tally, creator] = result;

    const now = BigInt(Math.floor(Date.now() / 1000));
    let status: Proposal["status"] = "pending";

    if (executed) {
      status = "executed";
    } else if (now < parameters.votingStart) {
      status = "pending";
    } else if (now >= parameters.votingStart && now <= parameters.votingEnd) {
      status = "active";
    } else {
      status = "defeated";
    }

    return {
      id,
      executed,
      votingStart: parameters.votingStart,
      votingEnd: parameters.votingEnd,
      tally: {
        abstain: tally.abstain,
        yes: tally.yes,
        no: tally.no,
      },
      creator,
      status,
    };
  } catch {
    return null;
  }
}

export async function getAllProposals(): Promise<Proposal[]> {
  const count = await getProposalCount();
  const proposals: Proposal[] = [];

  for (let i = Number(count); i >= 1; i--) {
    const proposal = await getProposal(i);
    if (proposal) {
      proposals.push(proposal);
    }
  }

  return proposals;
}

export async function getActiveProposals(): Promise<Proposal[]> {
  const all = await getAllProposals();
  return all.filter((p) => p.status === "active" || p.status === "pending");
}

export function enrichProposal(proposal: Proposal): ProposalWithVotes {
  const totalVotes =
    proposal.tally.yes + proposal.tally.no + proposal.tally.abstain;

  const toPercent = (value: bigint) =>
    totalVotes > BigInt(0) ? (Number(value) / Number(totalVotes)) * 100 : 0;

  return {
    ...proposal,
    totalVotes,
    yesPercent: toPercent(proposal.tally.yes),
    noPercent: toPercent(proposal.tally.no),
    abstainPercent: toPercent(proposal.tally.abstain),
  };
}

export function getProposalStatus(proposal: Proposal): string {
  switch (proposal.status) {
    case "active":
      return "Active";
    case "pending":
      return "Pending";
    case "executed":
      return "Executed";
    case "defeated":
      return "Closed";
    default:
      return "Unknown";
  }
}

export function formatTimestamp(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getTimeRemaining(votingEnd: bigint): string {
  const now = BigInt(Math.floor(Date.now() / 1000));
  const remaining = votingEnd - now;

  if (remaining <= BigInt(0)) return "Ended";

  const days = remaining / BigInt(86400);
  const hours = (remaining % BigInt(86400)) / BigInt(3600);
  const minutes = (remaining % BigInt(3600)) / BigInt(60);

  if (days > BigInt(0)) return `${days}d ${hours}h remaining`;
  if (hours > BigInt(0)) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getArbiscanUrl(type: "address" | "tx", hash: string): string {
  return `https://arbiscan.io/${type}/${hash}`;
}
