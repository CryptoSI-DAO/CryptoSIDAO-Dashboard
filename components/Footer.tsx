import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary py-4 md:py-6">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 flex flex-col items-center gap-3 md:gap-4">
        <p className="text-xs md:text-sm text-text-secondary text-center">
          CryptoSI DAO &middot; Built on Aragon OSx &middot; Arbitrum
        </p>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          <a
            href="https://twitter.com/Crypto_SI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-accent-purple transition-colors text-xs md:text-sm"
          >
            Twitter
          </a>
          <a
            href="https://discord.gg/VSPUucsyvn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-accent-purple transition-colors text-xs md:text-sm"
          >
            Discord
          </a>
          <a
            href="https://github.com/CryptoSI-DAO"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-accent-purple transition-colors text-xs md:text-sm"
          >
            GitHub
          </a>
          <a
            href="https://cryptosidao.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-accent-purple transition-colors text-xs md:text-sm"
          >
            Website
          </a>
        </div>
      </div>
    </footer>
  );
}
