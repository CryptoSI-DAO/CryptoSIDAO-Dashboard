"use client";

import { useState, useEffect } from "react";
import { publicClient, TOKEN_ADDRESS, DAO_ADDRESS } from "@/lib/contracts";

// ── Types ──────────────────────────────────────────────────────────────────

export interface Member {
  address: string;
  balance: bigint;
  balanceFormatted: string;
  percentOfTotal: number;
  isContract: boolean;
}

// ── Data Fetching ──────────────────────────────────────────────────────────

/**
 * Get all token holders by scanning Transfer events.
 * For a governance DAO, "members" = anyone with a positive token balance.
 */
export async function getMembers(): Promise<{ members: Member[]; totalSupply: bigint }> {
  try {
    const latestBlock = await publicClient.getBlockNumber();
    const fromBlock = latestBlock - 100000n > 0n ? latestBlock - 100000n : 0n;

    // Get all Transfer events for the token
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

    // Build balance map from transfer history
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

    // Get total supply for percentage calculation
    const totalSupply = await publicClient.readContract({
      address: TOKEN_ADDRESS,
      abi: [{ name: "totalSupply", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] }],
      functionName: "totalSupply",
    }).catch(() => 0n) as bigint;

    // Filter to positive balances and check which are contracts
    const members: Member[] = [];
    for (const [address, balance] of balances) {
      if (balance > 0n) {
        // Check if it's a contract
        let isContract = false;
        try {
          const code = await publicClient.getCode({ address: address as `0x${string}` });
          isContract = code !== undefined && code !== "0x";
        } catch { /* assume EOA */ }

        const balanceFormatted = formatTokenBalance(balance, 18);
        const percentOfTotal = totalSupply > 0n
          ? Number((balance * 10000n) / totalSupply) / 100
          : 0;

        members.push({
          address,
          balance,
          balanceFormatted,
          percentOfTotal,
          isContract,
        });
      }
    }

    // Sort by balance descending
    members.sort((a, b) => (b.balance > a.balance ? 1 : -1));

    return { members, totalSupply };
  } catch (e) {
    console.error("Failed to fetch members:", e);
    return { members: [], totalSupply: 0n };
  }
}

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
