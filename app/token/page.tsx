import { getTokenInfo } from "@/lib/token";

export const revalidate = 60;

export default async function TokenPage() {
  const token = await getTokenInfo().catch(() => null);

  if (!token) {
    return (
      <div className="bg-bg-card rounded-xl border border-border p-8 text-center">
        <p className="text-text-secondary">Unable to load token info</p>
        <p className="text-sm text-text-secondary/60 mt-1">
          The token contract could not be reached.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Token Info</h1>
        <p className="text-sm text-text-secondary mt-1">
          Governance token for CryptoSI DAO
        </p>
      </div>

      <div className="bg-bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white font-bold text-xl">
            {token.symbol.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">{token.name}</h2>
            <p className="text-text-secondary">{token.symbol}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="Symbol" value={token.symbol} />
          <InfoRow label="Decimals" value={token.decimals.toString()} />
          <InfoRow
            label="Total Supply"
            value={`${token.totalSupplyFormatted} ${token.symbol}`}
          />
          <InfoRow
            label="Contract"
            value={
              <a
                href={`https://arbiscan.io/address/${token.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-purple hover:text-accent-pink font-mono text-sm"
              >
                {token.address.slice(0, 6)}...{token.address.slice(-4)}
              </a>
            }
          />
        </div>
      </div>

      <div className="bg-bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">
          Contract Details
        </h3>
        <div className="space-y-3">
          <InfoRow
            label="Token Address"
            value={
              <span className="font-mono text-sm break-all">
                {token.address}
              </span>
            }
          />
          <InfoRow
            label="DAO Address"
            value={
              <span className="font-mono text-sm break-all">
                0xA736319152057f9c3beb556EeE76Ea56598FFa13
              </span>
            }
          />
          <InfoRow label="Network" value="Arbitrum One (Chain ID: 42161)" />
          <InfoRow label="Standard" value="ERC-20" />
          <InfoRow label="Governance" value="Aragon OSx Token Voting" />
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 py-2 border-b border-border/50 last:border-0">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm text-text-primary font-medium">{value}</span>
    </div>
  );
}
