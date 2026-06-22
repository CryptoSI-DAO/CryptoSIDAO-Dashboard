"use client";

export default function MembersPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-text-primary">Members</h1>
        <p className="text-xs md:text-sm text-text-secondary mt-1">
          Token holders with voting power in CryptoSI DAO
        </p>
      </div>

      <div className="bg-bg-card rounded-xl border border-border p-8 md:p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-purple/10 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-purple">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">Functionality coming soon</h2>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          Member listing with token balances and voting power is under development.
          Check back soon for a full directory of DAO participants.
        </p>
      </div>
    </div>
  );
}
