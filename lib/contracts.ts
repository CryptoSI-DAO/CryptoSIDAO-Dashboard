import { createPublicClient, http, fallback, decodeEventLog, getContract } from "viem";
import { arbitrum } from "viem/chains";

// ── Contracts ──────────────────────────────────────────────────────────────

export const DAO_ADDRESS = "0xA736319152057f9c3beb556EeE76Ea56598FFa13" as const;
export const TOKEN_ADDRESS = "0x239f89d0a2484f548a43d40244823623f3732a8b" as const;
export const GOVERNANCE_PLUGIN_ADDRESS =
  "0x1aed2beb470aefd65b43f905bd5371b1e4749d18" as const;

// ── RPC ────────────────────────────────────────────────────────────────────

const ARBITRUM_RPC_PRIMARY = "https://arb1.arbitrum.io/rpc";
const ARBITRUM_RPC_FALLBACK = "https://arbitrum.llamarpc.com";

export const publicClient = createPublicClient({
  chain: arbitrum,
  transport: fallback([
    http(ARBITRUM_RPC_PRIMARY),
    http(ARBITRUM_RPC_FALLBACK),
  ]),
});

// ── ABIs ───────────────────────────────────────────────────────────────────

// Minimal DAO proxy ABI (ERC-1967)
export const DAO_PROXY_ABI = [
  {
    name: "daoURI",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
] as const;

// ERC-20 Token ABI
export const ERC20_ABI = [
  {
    name: "name",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

// Aragon OSx Governance Plugin ABI (token voting)
// Matches the actual TokenVoting.sol / MajorityVotingBase.sol interface
export const GOVERNANCE_PLUGIN_ABI = [
  {
    name: "getProposal",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_proposalId", type: "uint256" }],
    outputs: [
      { name: "open", type: "bool" },
      { name: "executed", type: "bool" },
      {
        name: "parameters",
        type: "tuple",
        components: [
          { name: "votingMode", type: "uint8" },
          { name: "supportThreshold", type: "uint32" },
          { name: "startDate", type: "uint64" },
          { name: "endDate", type: "uint64" },
          { name: "snapshotTimepoint", type: "uint64" },
          { name: "minVotingPower", type: "uint256" },
        ],
      },
      {
        name: "tally",
        type: "tuple",
        components: [
          { name: "abstain", type: "uint256" },
          { name: "yes", type: "uint256" },
          { name: "no", type: "uint256" },
        ],
      },
      {
        name: "actions",
        type: "tuple[]",
        components: [
          { name: "to", type: "address" },
          { name: "value", type: "uint256" },
          { name: "data", type: "bytes" },
        ],
      },
      { name: "allowFailureMap", type: "uint256" },
      {
        name: "targetConfig",
        type: "tuple",
        components: [
          { name: "target", type: "address" },
          { name: "operation", type: "uint8" },
          { name: "ethValue", type: "uint256" },
        ],
      },
    ],
  },
  {
    name: "getVoteOption",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "_proposalId", type: "uint256" },
      { name: "_voter", type: "address" },
    ],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    name: "proposalThreshold",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "supportThreshold",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint32" }],
  },
  {
    name: "minParticipation",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint32" }],
  },
  {
    name: "canExecute",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_proposalId", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "hasSucceeded",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_proposalId", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

// Event ABI for proposal discovery via event logs
export const PROPOSAL_CREATED_EVENT_ABI = {
  name: "ProposalCreated",
  type: "event" as const,
  inputs: [
    { name: "proposalId", type: "uint256", indexed: true },
    { name: "creator", type: "address", indexed: true },
    { name: "startDate", type: "uint64", indexed: false },
    { name: "endDate", type: "uint64", indexed: false },
    { name: "metadata", type: "bytes", indexed: false },
    {
      name: "actions",
      type: "tuple[]",
      indexed: false,
      components: [
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "data", type: "bytes" },
      ],
    },
    { name: "allowFailureMap", type: "uint256", indexed: false },
  ],
} as const;

// Aragon OSx DAO ABI (implementation)
export const DAO_IMPLEMENTATION_ABI = [
  {
    name: "daoURI",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
] as const;

// ────────────────────────────────────────────────────────────────────────────
// Contract references
// ────────────────────────────────────────────────────────────────────────────

export const daoContract = {
  address: DAO_ADDRESS,
  abi: DAO_PROXY_ABI,
} as const;

export const tokenContract = {
  address: TOKEN_ADDRESS,
  abi: ERC20_ABI,
} as const;

export const governancePluginContract = {
  address: GOVERNANCE_PLUGIN_ADDRESS,
  abi: GOVERNANCE_PLUGIN_ABI,
} as const;

export const daoImplementationContract = {
  address: "0xbf8b2c4062e1d1060c332bf3305ef03971c90859" as const,
  abi: DAO_IMPLEMENTATION_ABI,
} as const;
