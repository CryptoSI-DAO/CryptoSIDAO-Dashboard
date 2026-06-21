import { decodeEventLog } from "viem";
import { publicClient, governancePluginContract, GOVERNANCE_PLUGIN_ADDRESS, PROPOSAL_CREATED_EVENT_ABI } from "./contracts";

export type VoteOption = "abstain" | "yes" | "no";

export interface ProposalAction {
  to: string;
  value: bigint;
  data: string;
}

export interface ProposalTally {
  abstain: bigint;
  yes: bigint;
  no: bigint;
}

export interface ProposalParameters {
  votingMode: number;
  supportThreshold: number;
  startDate: bigint;
  endDate: bigint;
  snapshotTimepoint: bigint;
  minVotingPower: bigint;
}

export interface Proposal {
  id: string; // bytes32 proposal ID (hex)
  executed: boolean;
  open: boolean;
  parameters: ProposalParameters;
  tally: ProposalTally;
  actions: ProposalAction[];
  allowFailureMap: bigint;
  creator: string;
  metadata: string;
  status: "pending" | "active" | "executed" | "defeated";
}

export interface ProposalWithVotes extends Proposal {
  totalVotes: bigint;
  yesPercent: number;
  noPercent: number;
  abstainPercent: number;
}

// ── Event-based proposal discovery ─────────────────────────────────────────

/**
 * Discover all proposals by scanning ProposalCreated events from the governance plugin.
 * This is the reliable way to find proposals since there's no proposalCount() function.
 */
export async function getAllProposalIds(): Promise<{ id: string; creator: string }[]> {
  try {
    const latestBlock = await publicClient.getBlockNumber();
    const fromBlock = latestBlock - 50000n > 0n ? latestBlock - 50000n : 0n;

    const logs = await publicClient.getLogs({
      address: GOVERNANCE_PLUGIN_ADDRESS,
      fromBlock,
      toBlock: latestBlock,
    });

    const results: { id: string; creator: string }[] = [];

    for (const log of logs as any[]) {
      // Decode the log manually using the ABI
      try {
        const decoded = decodeEventLog({
          abi: [PROPOSAL_CREATED_EVENT_ABI] as const,
          data: log.data,
          topics: log.topics as any,
        });
        if (decoded.eventName === "ProposalCreated" && decoded.args) {
          const args = decoded.args as any;
          const proposalIdHex = "0x" + (args.proposalId as bigint).toString(16).padStart(64, "0");
          results.push({
            id: proposalIdHex,
            creator: args.creator as string,
          });
        }
      } catch {
        // Not a ProposalCreated event, skip
      }
    }

    return results;
  } catch (e) {
    console.error("Failed to fetch proposal IDs from events:", e);
    return [];
  }
}

// ── Individual proposal fetching ───────────────────────────────────────────

export async function getProposal(id: string): Promise<Proposal | null> {
  try {
    const proposalIdBigInt = BigInt("0x" + id);

    const result = await publicClient.readContract({
      ...governancePluginContract,
      functionName: "getProposal",
      args: [proposalIdBigInt],
    });

    const [open, executed, parameters, tally, actions, allowFailureMap] = result;

    const now = BigInt(Math.floor(Date.now() / 1000));
    let status: Proposal["status"] = "pending";

    if (executed) {
      status = "executed";
    } else if (now < parameters.startDate) {
      status = "pending";
    } else if (now >= parameters.startDate && now <= parameters.endDate) {
      status = "active";
    } else {
      status = "defeated";
    }

    return {
      id,
      executed,
      open,
      parameters: {
        votingMode: parameters.votingMode,
        supportThreshold: parameters.supportThreshold,
        startDate: parameters.startDate,
        endDate: parameters.endDate,
        snapshotTimepoint: parameters.snapshotTimepoint,
        minVotingPower: parameters.minVotingPower,
      },
      tally: {
        abstain: tally.abstain,
        yes: tally.yes,
        no: tally.no,
      },
      actions: actions.map((a: any) => ({
        to: a.to,
        value: a.value,
        data: a.data,
      })),
      allowFailureMap,
      creator: "0x0000000000000000000000000000000000000000", // Will be filled from events
      metadata: "",
      status,
    };
  } catch (e) {
    console.error(`Failed to fetch proposal ${id}:`, e);
    return null;
  }
}

// ── Batch operations ───────────────────────────────────────────────────────

export async function getAllProposals(): Promise<Proposal[]> {
  const proposalIds = await getAllProposalIds();
  const proposals: Proposal[] = [];

  for (const { id, creator } of proposalIds) {
    const proposal = await getProposal(id);
    if (proposal) {
      proposal.creator = creator;
      proposals.push(proposal);
    }
  }

  // Sort by start date descending (newest first)
  proposals.sort((a, b) => Number(b.parameters.startDate - a.parameters.startDate));

  return proposals;
}

export async function getActiveProposals(): Promise<Proposal[]> {
  const all = await getAllProposals();
  return all.filter((p) => p.status === "active" || p.status === "pending");
}

// ── Enrichment helpers ─────────────────────────────────────────────────────

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
