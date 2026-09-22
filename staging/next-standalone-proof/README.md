# Agyflow Next.js Standalone Staging Proof

This isolated application verifies that Rumahweb cPanel can run a Next.js 14 standalone server without changing the static production deployment.

## Routes

- `/` — dynamic App Router page
- `/routing-proof` — nested App Router page
- `/api/health` — Node.js runtime and MySQL `SELECT 1` health check
- `/proof.txt` — static asset

## Build

From this directory:

```bash
npm run build
npm run prepare:deploy -- <output-directory>
```

The build resolves the repository's root dependencies and emits a standalone server. `prepare:deploy` assembles the standalone server, traced runtime dependencies, `.next/static`, and `public` files into one uploadable directory.

## Runtime variables

- `DATABASE_URL` — staging-only MySQL connection URL
- `STAGING_DEPLOYMENT_ID` — non-secret deployment marker
- `NODE_ENV=production`

Never commit real values. Local staging credentials are kept in the gitignored repository file `.env.staging.local`; cPanel stores the runtime values in Node.js App environment variables.

## Isolation

Production remains the static site under `public_html`. This proof runs from the separate cPanel application root `staging-node-proof` and is mapped only to `staging.agyflow.com`.
