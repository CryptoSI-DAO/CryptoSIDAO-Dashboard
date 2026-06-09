import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-text-secondary">
          CryptoSI DAO &middot; Built on Aragon OSx &middot; Arbitrum
        </p>
        <div className="flex gap-4">
          <a
            href="https://twitter.com/Crypto_SI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-accent-purple transition-colors text-sm"
          >
            Twitter
          </a>
          <a
            href="https://discord.gg/VSPUucsyvn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-accent-purple transition-colors text-sm"
          >
            Discord
          </a>
          <a
            href="https://github.com/CryptoSI-DAO"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-accent-purple transition-colors text-sm"
          >
            GitHub
          </a>
          <a
            href="https://cryptosidaodao.tech/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-accent-purple transition-colors text-sm"
          >
            Website
          </a>
        </div>
      </div>
    </footer>
  );
}
