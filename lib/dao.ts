import { publicClient, DAO_ADDRESS, TOKEN_ADDRESS, GOVERNANCE_PLUGIN_ADDRESS } from "./contracts";

// ── DAO Metadata ───────────────────────────────────────────────────────────

export interface DaoMetadata {
  name: string;
  description: string;
  links: { name: string; url: string }[];
  avatar: string;
}

export async function getDaoMetadata(): Promise<DaoMetadata> {
  try {
    const daoURI = await publicClient.readContract({
      address: DAO_ADDRESS,
      abi: [{ name: "daoURI", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] }],
      functionName: "daoURI",
    }) as string;

    if (!daoURI) return defaultMetadata();

    if (daoURI.startsWith("ipfs://")) {
      const hash = daoURI.replace("ipfs://", "");
      const res = await fetchWithFallbackGateways(hash);
      return JSON.parse(res) as DaoMetadata;
    }

    if (daoURI.startsWith("http")) {
      const res = await fetch(daoURI);
      return await res.json();
    }

    return defaultMetadata();
  } catch {
    return defaultMetadata();
  }
}

function defaultMetadata(): DaoMetadata {
  return {
    name: "CryptoSI DAO",
    description: "CryptoSI DAO is a decentralized autonomous organization built on Arbitrum.",
    links: [],
    avatar: "",
  };
}

async function fetchWithFallbackGateways(hash: string): Promise<string> {
  const gateways = [
    "https://ipfs.io/ipfs/",
    "https://gateway.pinata.cloud/ipfs/",
    "https://cloudflare-ipfs.com/ipfs/",
    "https://dweb.link/ipfs/",
  ];
  for (const gw of gateways) {
    try {
      const res = await fetch(`${gw}${hash}`, { signal: AbortSignal.timeout(8000) });
      if (res.ok) return await res.text();
    } catch { continue; }
  }
  throw new Error("All IPFS gateways failed");
}

// ── Proposals ──────────────────────────────────────────────────────────────

export interface ProposalAction {
  to: string;
  value: bigint;
  data: string;
}

export interface Proposal {
  id: string;
  creator: string;
  metadataUri: string;
  metadata?: ProposalMetadata;
  startDate: bigint;
  endDate: bigint;
  executed: boolean;
  status: "pending" | "active" | "executed" | "defeated" | "unknown";
  tally: { yes: bigint; no: bigint; abstain: bigint };
  actions: ProposalAction[];
  blockNumber: number;
  txHash: string;
}

export interface ProposalMetadata {
  name: string;
  description: string;
  media?: { logo?: string };
}

export async function getAllProposals(): Promise<Proposal[]> {
  try {
    const latestBlock = await publicClient.getBlockNumber();
    const fromBlock = latestBlock - 100000n > 0n ? latestBlock - 100000n : 0n;

    // Get ALL events from the governance plugin
    const logs = await publicClient.getLogs({
      address: GOVERNANCE_PLUGIN_ADDRESS,
      fromBlock,
      toBlock: latestBlock,
    });

    const proposals: Proposal[] = [];
    const seenIds = new Set<string>();

    for (const log of logs as any[]) {
      // ProposalCreated events have 4 topics: sig, proposalId, creator, target
      if (log.topics.length < 4) continue;

      const proposalId = log.topics[1].toLowerCase();
      const creator = "0x" + log.topics[2].slice(26).toLowerCase();

      if (seenIds.has(proposalId)) continue;
      seenIds.add(proposalId);

      // Try to extract IPFS metadata from the event data
      let metadataUri = "";
      const rawData = log.data.slice(2);
      if (rawData.length > 192) {
        try {
          // Look for IPFS URI in the data
          const strMatch = rawData.match(/697066733a2f2f([a-f0-9]+)/i);
          if (strMatch) {
            const hexStr = "697066733a2f2f" + strMatch[1];
            const decoded = Buffer.from(hexStr, "hex").toString("utf-8");
            const uriMatch = decoded.match(/ipfs:\/\/[a-zA-Z0-9/]+/);
            if (uriMatch) metadataUri = uriMatch[0];
          }
        } catch { /* ignore decode errors */ }
      }

      // Get block timestamp for dates
      let startDate = 0n;
      let endDate = 0n;
      try {
        const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
        startDate = block.timestamp;
        endDate = startDate + 604800n; // Default 7-day voting period
      } catch { /* ignore */ }

      proposals.push({
        id: proposalId,
        creator,
        metadataUri,
        startDate,
        endDate,
        executed: false,
        status: "unknown",
        tally: { yes: 0n, no: 0n, abstain: 0n },
        actions: [],
        blockNumber: Number(log.blockNumber),
        txHash: log.transactionHash,
      });
    }

    // Sort by block number descending (newest first)
    proposals.sort((a, b) => b.blockNumber - a.blockNumber);

    return proposals;
  } catch (e) {
    console.error("Failed to fetch proposals:", e);
    return [];
  }
}

export async function fetchProposalMetadata(uri: string): Promise<ProposalMetadata | undefined> {
  if (!uri || !uri.startsWith("ipfs://")) return undefined;
  try {
    const hash = uri.replace("ipfs://", "");
    const res = await fetchWithFallbackGateways(hash);
    const data = JSON.parse(res);
    return {
      name: data.name || data.title || "Untitled Proposal",
      description: data.description || data.body || data.change || "",
      media: data.media || data.images,
    };
  } catch {
    return undefined;
  }
}

// ── Members ────────────────────────────────────────────────────────────────

export interface Member {
  address: string;
  balance: string;
  delegated: boolean;
}

export async function getMembers(): Promise<Member[]> {
  try {
    // Get token holders by scanning Transfer events
    const latestBlock = await publicClient.getBlockNumber();
    const fromBlock = latestBlock - 100000n > 0n ? latestBlock - 100000n : 0n;

    const logs = await publicClient.getLogs({
      address: TOKEN_ADDRESS,
      fromBlock,
      toBlock: latestBlock,
      event: {
        type: "event",
        name: "Transfer",
        inputs: [
          { name: "from", type: "address", indexed: true },
          { name: "to", type: "address", indexed: true },
          { name: "value", type: "uint256", indexed: false },
        ],
      },
    });

    const balances = new Map<string, bigint>();

    for (const log of logs as any[]) {
      const from = "0x" + (log.topics[1]?.slice(26) || "").toLowerCase();
      const to = "0x" + (log.topics[2]?.slice(26) || "").toLowerCase();
      const value = BigInt(log.data || "0x0");

      if (from && from !== "0x0000000000000000000000000000000000000000") {
        balances.set(from, (balances.get(from) || 0n) - value);
      }
      if (to) {
        balances.set(to, (balances.get(to) || 0n) + value);
      }
    }

    // Filter out zero balances and sort
    const members: Member[] = [];
    for (const [address, balance] of balances) {
      if (balance > 0n) {
        members.push({
          address,
          balance: formatTokenBalance(balance, 18),
          delegated: false,
        });
      }
    }

    members.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));
    return members;
  } catch (e) {
    console.error("Failed to fetch members:", e);
    return [];
  }
}

// ── Assets ─────────────────────────────────────────────────────────────────

export interface Asset {
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  address: string;
  usdValue?: string;
}

export async function getAssets(): Promise<Asset[]> {
  const assets: Asset[] = [];

  try {
    // Get ETH balance of the DAO
    const ethBalance = await publicClient.getBalance({ address: DAO_ADDRESS });
    if (ethBalance > 0n) {
      assets.push({
        symbol: "ETH",
        name: "Ethereum",
        balance: formatTokenBalance(ethBalance, 18),
        decimals: 18,
        address: "0x0000000000000000000000000000000000000000",
      });
    }

    // Get the governance token info
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      publicClient.readContract({ address: TOKEN_ADDRESS, abi: [{ name: "name", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] }], functionName: "name" }).catch(() => "CRDD"),
      publicClient.readContract({ address: TOKEN_ADDRESS, abi: [{ name: "symbol", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] }], functionName: "symbol" }).catch(() => "CRDD"),
      publicClient.readContract({ address: TOKEN_ADDRESS, abi: [{ name: "decimals", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] }], functionName: "decimals" }).catch(() => 18),
      publicClient.readContract({ address: TOKEN_ADDRESS, abi: [{ name: "totalSupply", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] }], functionName: "totalSupply" }).catch(() => 0n),
    ]);

    // Get DAO's token balance
    const daoTokenBalance = await publicClient.readContract({
      address: TOKEN_ADDRESS,
      abi: [{ name: "balanceOf", type: "function", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] }],
      functionName: "balanceOf",
      args: [DAO_ADDRESS],
    }).catch(() => 0n) as bigint;

    assets.push({
      symbol: symbol as string,
      name: name as string,
      balance: formatTokenBalance(daoTokenBalance as bigint, decimals as number),
      decimals: decimals as number,
      address: TOKEN_ADDRESS,
    });

    // Add total supply info
    if (totalSupply as bigint > 0n) {
      assets.push({
        symbol: `${symbol} (Total Supply)`,
        name: `${name} Total Supply`,
        balance: formatTokenBalance(totalSupply as bigint, decimals as number),
        decimals: decimals as number,
        address: TOKEN_ADDRESS,
      });
    }
  } catch (e) {
    console.error("Failed to fetch assets:", e);
  }

  return assets;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatTokenBalance(value: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals);
  const intPart = value / divisor;
  const fracPart = value % divisor;
  if (fracPart === 0n) return intPart.toLocaleString("en-US");
  const fracStr = fracPart.toString().padStart(decimals, "0").replace(/0+$/, "");
  return `${intPart.toLocaleString("en-US")}.${fracStr}`;
}

export function shortenAddress(address: string): string {
  if (!address || address === "0x0000000000000000000000000000000000000000") return "—";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getArbiscanUrl(type: "address" | "tx", hash: string): string {
  return `https://arbiscan.io/${type}/${hash}`;
}
