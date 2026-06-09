import { publicClient, daoContract } from "./contracts";

export interface DaoMetadata {
  name: string;
  description: string;
  links: { name: string; url: string }[];
  avatar: string;
}

const IPFS_GATEWAYS = [
  "https://ipfs.io/ipfs/",
  "https://gateway.pinata.cloud/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
];

async function fetchFromIPFS(ipfsUri: string): Promise<string> {
  const hash = ipfsUri.replace("ipfs://", "");
  for (const gateway of IPFS_GATEWAYS) {
    try {
      const res = await fetch(`${gateway}${hash}`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) return await res.text();
    } catch {
      continue;
    }
  }
  throw new Error(`Failed to fetch IPFS content: ${ipfsUri}`);
}

export async function getDaoMetadata(): Promise<DaoMetadata> {
  const daoURI = await publicClient.readContract({
    ...daoContract,
    functionName: "daoURI",
  });

  if (!daoURI) {
    return {
      name: "CryptoSI DAO",
      description: "CryptoSI DAO is a decentralized autonomous organization built on Arbitrum.",
      links: [],
      avatar: "",
    };
  }

  if (daoURI.startsWith("ipfs://")) {
    const raw = await fetchFromIPFS(daoURI);
    return JSON.parse(raw) as DaoMetadata;
  }

  if (daoURI.startsWith("http")) {
    const res = await fetch(daoURI, { signal: AbortSignal.timeout(10000) });
    return (await res.json()) as DaoMetadata;
  }

  return {
    name: "CryptoSI DAO",
    description: daoURI,
    links: [],
    avatar: "",
  };
}
