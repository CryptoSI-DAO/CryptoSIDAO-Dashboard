"use client";

import { useState, useEffect } from "react";
import { getMembers, shortenAddress, getArbiscanUrl, type Member } from "@/lib/dao";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMembers()
      .then(setMembers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-text-primary">Members</h1>
        <p className="text-xs md:text-sm text-text-secondary mt-1">
          Token holders with voting power in CryptoSI DAO
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-bg-card rounded-xl border border-border p-4 h-16 animate-pulse" />
          ))}
        </div>
      ) : members.length > 0 ? (
        <div className="bg-bg-card rounded-xl border border-border overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-3 gap-4 px-4 md:px-6 py-3 bg-bg-secondary border-b border-border text-xs font-medium text-text-secondary uppercase tracking-wider">
            <span>Address</span>
            <span className="text-right">Balance</span>
            <span className="text-right">Voting Power</span>
          </div>

          {/* Member rows */}
          <div className="divide-y divide-border/50">
            {members.map((member, index) => (
              <div
                key={member.address}
                className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 px-4 md:px-6 py-3 md:py-4 hover:bg-bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-secondary font-mono w-6">#{index + 1}</span>
                  <a
                    href={getArbiscanUrl("address", member.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-purple hover:text-accent-pink font-mono text-sm truncate"
                  >
                    {shortenAddress(member.address)}
                  </a>
                </div>
                <div className="text-right text-sm text-text-primary font-medium pl-9 sm:pl-0">
                  {member.balance} <span className="text-text-secondary text-xs">CRDD</span>
                </div>
                <div className="text-right text-sm text-text-secondary pl-9 sm:pl-0">
                  {member.delegated ? "Delegated" : "Self-held"}
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

      {members.length > 0 && (
        <div className="bg-bg-card rounded-xl border border-border p-4 md:p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-text-secondary mb-1">Total Members</p>
              <p className="text-xl md:text-2xl font-bold text-text-primary">{members.length}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">Total Voting Power</p>
              <p className="text-xl md:text-2xl font-bold text-text-primary">
                {members.reduce((sum, m) => sum + parseFloat(m.balance.replace(/,/g, "")), 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-xs text-text-secondary mb-1">Token</p>
              <p className="text-xl md:text-2xl font-bold text-accent-purple">CRDD</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
