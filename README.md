# Agyflow Web (`agyflow.com`)

The official modern web portal for **Agyflow** — The Autonomous Multi-Agent Workspace & Micro-SaaS Suite.

## 🚀 Overview

Agyflow provides high-reliability, deterministic business operations by orchestrating specialized AI agent hierarchies using Google ADK design patterns (Sequential, Loop, and Parallel) and the open Model Context Protocol (MCP).

### 📦 Ecosystem Products
- **GDPR & Privacy Policy Assistant**: Compliance document generator for web agencies and website owners.
- **AI Customer Support Reply Assistant**: Smart multi-lingual reply assistant with human-in-the-loop safeguards.
- **Invoice Follow-Up & Reminder SaaS**: Automated payment recovery and polite follow-up schedules.

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router, Server Components)
- **Styling**: Tailwind CSS, Dark Tech Aesthetic (Linear / Vercel design system)
- **Icons**: Lucide React
- **Payments**: Lemon Squeezy Merchant of Record integration
- **Domain**: `agyflow.com` (Registered at Rumahweb, DNS connected to Vercel)

## 🌐 DNS Setup (Rumahweb ➡️ Vercel)
In your Rumahweb Client Area (DNS Management for `agyflow.com`):

| Type | Host | Target / RDATA | TTL |
|---|---|---|---|
| **A Record** | `@` | `76.76.21.21` | 3600 |
| **CNAME** | `www` | `cname.vercel-dns.com.` | 3600 |

## 💻 Development
```bash
# Run local development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```
