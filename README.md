# CryptoSI DAO Dashboard

Real-time governance dashboard for CryptoSI DAO. Reads on-chain voting data from the Aragon OSx DAO deployed on Arbitrum.

## Features

- **Dashboard** — DAO overview, stats, active proposals, recent activity
- **Proposals** — Filterable list of all proposals with vote breakdowns
- **Proposal Detail** — Full vote results, voter info, on-chain data with Arbiscan links
- **Token Info** — Governance token details (CRDD)

## Quick Start

```bash
npm install --legacy-peer-deps
npm run dev     # Development at localhost:3000
npm run build   # Production build (static export)
```

## Tech Stack

- Next.js 15 (App Router, static export)
- viem (lightweight Ethereum client)
- Tailwind CSS (dark theme)
- Deployed to GitHub Pages

## Chain Info

| | |
|---|---|
| **Network** | Arbitrum One |
| **DAO** | `0xA736319152057f9c3beb556EeE76Ea56598FFa13` |
| **Token** | `CRDD` — CryptoSI DAO Token |
| **Governance** | Aragon OSx Token Voting |
