# cPanel Node.js Staging Proof

Date: 2026-09-21
Status: Verified

## Result

A standalone Node.js application is running on the Rumahweb cPanel account at:

- Application: `https://staging.agyflow.com/`
- Health check: `https://staging.agyflow.com/health`
- Server IP: `203.175.9.146`
- Runtime: CloudLinux Node.js Selector with Passenger
- Node.js: `v20.20.2`
- Application root: `staging-node-proof`
- Startup file: `app.js`
- Mode: production

The proof application is isolated from the production document root. The existing static production site remains deployed under `public_html`.

## Verified evidence

The public health endpoint returned HTTP 200 with:

```json
{
  "status": "ok",
  "runtime": "cpanel-passenger",
  "node": "v20.20.2",
  "deploymentId": "agyflow-cpanel-node-proof-v1"
}
```

The following capabilities were verified:

- The cPanel account exposes both Application Manager and Setup Node.js App.
- CloudLinux Node.js Selector is enabled.
- Passenger is active.
- Node.js 20.20.2 can start the application.
- The staging subdomain resolves to the Rumahweb server.
- HTTPS works with a valid certificate covering `staging.agyflow.com`.
- A non-secret environment variable reaches the running Node.js process.
- A cPanel-managed application restart completed successfully.
- The application remained reachable after the authenticated cPanel session ended.

## Production regression check

These production URLs continued returning HTTP 200 after staging was created:

- `https://agyflow.com/`
- `https://agyflow.com/products`
- `https://agyflow.com/de`
- `https://agyflow.com/fr`

The staging root and `/health` also returned HTTP 200.

## Scope and remaining work

This proves that the hosting account can run a persistent Node.js application. It does not yet prove that the full Next.js application, MySQL connectivity, Prisma or Drizzle migrations, file uploads, authentication, payment webhooks, or rollback procedures work in this environment.

Before migrating production, the next staging milestone is a minimal Next.js standalone deployment with:

1. `output: "standalone"` in a staging-only configuration.
2. A server-side health route.
3. MySQL `SELECT 1` through a staging database.
4. Static assets and image paths verified through Passenger.
5. Start, restart, deployment, and rollback checks.

Production must remain on the current static `out/` deployment until that milestone passes.
