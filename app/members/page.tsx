"use client";

import { useState, useEffect } from "react";
import { getMembers, shortenAddress, getArbiscanUrl, type Member } from "@/lib/members";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [totalSupply, setTotalSupply] = useState(0n);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMembers()
      .then(({ members, totalSupply }) => {
        setMembers(members);
        setTotalSupply(totalSupply);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalMembers = members.length;
  const totalVotingPower = members.reduce((sum, m) => sum + m.balance, 0n);

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-text-primary">Members</h1>
        <p className="text-xs md:text-sm text-text-secondary mt-1">
          Token holders with voting power in CryptoSI DAO
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-bg-card rounded-xl border border-border p-4 md:p-5">
          <p className="text-xs text-text-secondary mb-1">Total Members</p>
          <p className="text-2xl md:text-3xl font-bold text-text-primary">{totalMembers}</p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border p-4 md:p-5">
          <p className="text-xs text-text-secondary mb-1">Total Supply</p>
          <p className="text-2xl md:text-3xl font-bold text-text-primary truncate">
            {totalSupply > 0n ? formatTokenSupply(totalSupply) : "—"}
          </p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border p-4 md:p-5">
          <p className="text-xs text-text-secondary mb-1">Circulating</p>
          <p className="text-2xl md:text-3xl font-bold text-accent-purple truncate">
            {totalVotingPower > 0n ? formatTokenSupply(totalVotingPower) : "—"}
          </p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border p-4 md:p-5">
          <p className="text-xs text-text-secondary mb-1">Token</p>
          <p className="text-2xl md:text-3xl font-bold text-text-primary">CRDD</p>
        </div>
      </div>

      {/* Members Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-bg-card rounded-xl border border-border p-4 h-16 animate-pulse" />
          ))}
        </div>
      ) : members.length > 0 ? (
        <div className="bg-bg-card rounded-xl border border-border overflow-hidden">
          {/* Desktop header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-bg-secondary border-b border-border text-xs font-medium text-text-secondary uppercase tracking-wider">
            <span className="col-span-1">#</span>
            <span className="col-span-3">Address</span>
            <span className="col-span-2">Type</span>
            <span className="col-span-2 text-right">Balance</span>
            <span className="col-span-2 text-right">% of Supply</span>
            <span className="col-span-2 text-right">Voting Power</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border/50 max-h-[600px] overflow-y-auto">
            {members.map((member, index) => (
              <div
                key={member.address}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 md:px-5 py-3 md:py-4 hover:bg-bg-secondary/30 transition-colors"
              >
                <div className="md:col-span-1 flex items-center">
                  <span className="text-xs text-text-secondary font-mono">#{index + 1}</span>
                </div>

                <div className="md:col-span-3 flex items-center gap-2">
                  <a
                    href={getArbiscanUrl("address", member.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-purple hover:text-accent-pink font-mono text-sm truncate"
                  >
                    {member.address}
                  </a>
                </div>

                <div className="md:col-span-2 flex items-center">
                  {member.isContract ? (
                    <span className="text-[10px] font-medium bg-warning/10 text-warning px-2 py-0.5 rounded">
                      Contract
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium bg-success/10 text-success px-2 py-0.5 rounded">
                      Wallet
                    </span>
                  )}
                </div>

                <div className="md:col-span-2 text-right">
                  <span className="text-sm text-text-primary font-mono font-medium md:hidden">Balance: </span>
                  <span className="text-sm text-text-primary font-mono font-medium">
                    {member.balanceFormatted}
                  </span>
                </div>

                <div className="md:col-span-2 text-right">
                  <span className="text-sm text-text-secondary font-mono md:hidden">Supply: </span>
                  <span className="text-sm text-text-secondary font-mono">
                    {member.percentOfTotal.toFixed(2)}%
                  </span>
                </div>

                <div className="md:col-span-2 text-right">
                  <span className="text-sm font-mono md:hidden">Voting Power: </span>
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-bg-secondary rounded-full overflow-hidden hidden md:block">
                      <div
                        className="h-full bg-accent-purple rounded-full"
                        style={{ width: `${Math.min(member.percentOfTotal, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-accent-purple font-medium">
                      {member.percentOfTotal.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-bg-card rounded-xl border border-border p-8 md:p-12 text-center">
          <p className="text-text-secondary mb-2">No members found</p>
          <p className="text-xs md:text-sm text-text-secondary/60">
            Members will appear here once tokens are distributed.
          </p>
        </div>
      )}

      {/* Footer info */}
      <div className="bg-bg-card/50 rounded-xl border border-border/50 p-4 text-center">
        <p className="text-xs text-text-secondary">
          Members are determined by scanning CRDD token Transfer events. 
          Voting power is proportional to token balance. 
          {totalMembers > 0 && ` Showing ${totalMembers} holder${totalMembers !== 1 ? "s" : ""}.`}
        </p>
      </div>
    </div>
  );
}

function formatTokenSupply(value: bigint): string {
  const divisor = BigInt(10 ** 18);
  const intPart = value / divisor;
  return intPart.toLocaleString("en-US");
}
