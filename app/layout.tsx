import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0a0f",
};

export const metadata: Metadata = {
  title: "CryptoSI DAO Dashboard",
  description: "Governance dashboard for CryptoSI DAO — view proposals, votes, and token info on Arbitrum.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CryptoSI DAO",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-bg-primary">
        <Header />
        <main className="flex-1 max-w-6xl mx-auto w-full px-3 sm:px-4 py-4 md:py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
