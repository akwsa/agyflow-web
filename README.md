# Agyflow Web (`agyflow.com`)

The official modern web portal for **Agyflow** — The Autonomous Multi-Agent Workspace & Micro-SaaS Suite.

## 🚀 Overview

Agyflow provides high-reliability, deterministic business operations by orchestrating specialized AI agent hierarchies using Google ADK design patterns (Sequential, Loop, and Parallel) and the open Model Context Protocol (MCP).

### 📦 Ecosystem Products
- **GDPR & Privacy Policy Assistant**: Compliance document generator for web agencies and website owners.
- **AI Customer Support Reply Assistant**: Smart multi-lingual reply assistant with human-in-the-loop safeguards.
- **Invoice Follow-Up & Reminder SaaS**: Automated payment recovery and polite follow-up schedules.

### 🛒 Digital Product Catalog
`/products` lists 7 digital products with individual pages at
`/products/<slug>`. `data/products.json` is the single source of truth, and
`lib/products.ts` exposes it to the catalog and the SSG product pages.
Checkout is handled by Gumroad.

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router, Server Components), static export to `out/`
- **Styling**: Tailwind CSS, Dark Tech Aesthetic (Linear / Vercel design system)
- **Icons**: Lucide React
- **Payments**: Lemon Squeezy (subscription plans) and Gumroad (digital products)
- **Domain**: `agyflow.com`, registered at Rumahweb

## 🌐 Hosting

`agyflow.com` is served from **Rumahweb cPanel** (Apache/LiteSpeed). The domain
resolves to `203.175.9.146` — it is **not** hosted on Vercel.

Deployment is a manual upload of `out/` into `public_html/`. This repo has no
CI/CD configuration, so pushing to git does not deploy.

`public/.htaccess` is part of the deployment: the site is a static export with
`trailingSlash: false`, so clean URLs like `/de` and `/products/<slug>` only
resolve because of its rewrite rules. See `docs/BUILD.md`.

## ✉️ Support & contact

Four addresses are published in the site footer
(`components/Footer.tsx`), with translated labels in `lib/i18n.ts`:

| Purpose | Address | Footer label (EN / DE / FR) |
|---|---|---|
| Data protection / GDPR requests | `gdpr@agyflow.com` | GDPR / DSGVO / RGPD |
| Product help | `support@agyflow.com` | AI Help / KI-Hilfe / Aide IA |
| Payments, invoices, refunds | `billing@agyflow.com` | Billing / Abrechnung / Facturation |
| Everything else | `hello@agyflow.com` | General / Allgemein / Général |

All four are mailboxes on the `agyflow.com` domain at Rumahweb and **forward to
`wkagung@gmail.com`**. The forwarding is configured in cPanel, not in this
repo — changing an address here changes what the site displays, but the
mailbox and forwarder must be created in cPanel separately, or the address will
silently accept and drop mail.

`app/products/[slug]/page.tsx` also shows `hello@agyflow.com` on the
early-access path for the Montessori title.

There is currently **no** privacy policy, terms, or refund page on the site.
For a store selling to EU customers, `gdpr@agyflow.com` is the address those
pages would need to carry.

## 💻 Development

```bash
npm run dev          # local development server
npm run build        # production static export into out/
npm run preview      # serve out/ with production routing rules (127.0.0.1:4173)
npm run check-links  # verify internal links and assets resolve
npm run clean        # remove .next/, out/, dist/
```

`npm run build` runs `scripts/build.mjs`, not `next build` directly — see
`docs/BUILD.md` for why, plus the static routing rules and deploy steps.

- `docs/BUILD.md` — build system, routing, deploy
- `docs/DEPLOY.md` — FTP deploy procedure, backup, verification, rollback
- `docs/I18N.md` — English / German / French routing
- `CHANGELOG.md` — what changed, newest first

## 🤖 Copilot → Hermes Bridge

This project includes a typed Hermes adapter for integration with a Copilot-driven workflow and Hermes Agent Router.

### Environment
Create a `.env.local` from `.env.example` and set the Hermes endpoint for your runtime:

```bash
cp .env.example .env.local
```

Example:
```bash
HERMES_BASE_URL=https://hermes.example.com
HERMES_API_KEY=your-secret-key
HERMES_ROUTER_PATH=/api/v1/agent-router/route
HERMES_STATUS_PATH=/api/v1/agent-router/jobs
HERMES_TIMEOUT_MS=15000
```

### Adapter usage

The adapter lives in `lib/server/hermes.ts` and exposes:
- `sendToHermes(request)`
- `getHermesStatus(requestId)`
- validation helpers and typed response contracts

This repo is statically exported (`output: "export"`), so the integration is intentionally kept in a reusable server-side module for a real backend hook or Route Handler when one is added later.

See `docs/HERMES_INTEGRATION.md` for the full contract, security model, retry policy, and staging checklist.
