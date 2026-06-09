import { createPublicClient, http, fallback } from "viem";
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

// Minimal DAO proxy ABI (ERC-1967) — proxy delegates to implementation
// We call through the proxy for daoURI and plugin info
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
// Covers the core proposal + voting interface
export const GOVERNANCE_PLUGIN_ABI = [
  {
    name: "proposalCount",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getProposal",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_proposalId", type: "uint256" }],
    outputs: [
      { name: "executed", type: "bool" },
      { name: "parameters", type: "tuple", components: [
        { name: "votingStart", type: "uint64" },
        { name: "votingEnd", type: "uint64" },
      ]},
      { name: "tally", type: "tuple", components: [
        { name: "abstain", type: "uint256" },
        { name: "yes", type: "uint256" },
        { name: "no", type: "uint256" },
      ]},
      { name: "creator", type: "address" },
      { name: "allowFailureMap", type: "uint128" },
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
] as const;

// Aragon OSx DAO ABI (implementation) — for plugin enumeration
export const DAO_IMPLEMENTATION_ABI = [
  {
    name: "daoURI",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "getPlugin",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "pluginSetupRef", type: "bytes32" }],
    outputs: [{ name: "", type: "address" }],
  },
] as const;

// ────────────────────────────────────────────────────────────────────────────
// WAGMI-style typed contract references (use with useReadContract on client)
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
