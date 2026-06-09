import { publicClient, tokenContract } from "./contracts";

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  totalSupplyFormatted: string;
  address: string;
}

export async function getTokenInfo(): Promise<TokenInfo> {
  const [name, symbol, decimals, totalSupply] = await Promise.all([
    publicClient.readContract({ ...tokenContract, functionName: "name" }),
    publicClient.readContract({ ...tokenContract, functionName: "symbol" }),
    publicClient.readContract({ ...tokenContract, functionName: "decimals" }),
    publicClient.readContract({ ...tokenContract, functionName: "totalSupply" }),
  ]);

  const formatted = formatUnits(totalSupply, decimals);

  return {
    name,
    symbol,
    decimals,
    totalSupply,
    totalSupplyFormatted: formatted,
    address: tokenContract.address,
  };
}

function formatUnits(value: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals);
  const integerPart = value / divisor;
  const fractionalPart = value % divisor;

  if (fractionalPart === BigInt(0)) {
    return integerPart.toLocaleString("en-US");
  }

  const fracStr = fractionalPart.toString().padStart(decimals, "0").replace(/0+$/, "");
  return `${integerPart.toLocaleString("en-US")}.${fracStr}`;
}
