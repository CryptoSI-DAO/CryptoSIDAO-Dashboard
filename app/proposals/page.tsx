"use client";

export default function ProposalsPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-text-primary">Proposals</h1>
        <p className="text-xs md:text-sm text-text-secondary mt-1">
          Governance proposals for CryptoSI DAO
        </p>
      </div>

      <div className="bg-bg-card rounded-xl border border-border p-8 md:p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-purple/10 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-purple">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">Functionality coming soon</h2>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          Proposal listing with voting status and execution details is under development.
          Check back soon for full governance participation.
        </p>
      </div>
    </div>
  );
}
