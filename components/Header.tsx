"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/proposals", label: "Proposals" },
  { href: "/token", label: "Token" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-bg-secondary sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 md:gap-3">
          <img src="/logo.png" alt="CryptoSI DAO" className="w-8 h-8 md:w-10 md:h-10 rounded-lg" />
          <div>
            <h1 className="text-base md:text-lg font-bold text-text-primary">CryptoSI DAO</h1>
            <p className="text-[10px] md:text-xs text-text-secondary hidden sm:block">Governance Dashboard</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-1">
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

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-bg-secondary px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-accent-purple text-white"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-card"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
