"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/proposals", label: "Proposals" },
  { href: "/token", label: "Token" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-bg-secondary">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="CryptoSI DAO" className="w-10 h-10 rounded-lg" />
          <div>
            <h1 className="text-lg font-bold text-text-primary">CryptoSI DAO</h1>
            <p className="text-xs text-text-secondary">Governance Dashboard</p>
          </div>
        </Link>
        <nav className="flex gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-accent-purple text-white"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-card"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
