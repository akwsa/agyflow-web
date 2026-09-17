# Hermes Integration Guide

## Purpose

This project includes a typed Hermes adapter for the Copilot-to-Hermes bridge. The adapter is designed to be safe for a static-export Next.js deployment, so it does not add fake API routes and is ready to be consumed by a real Route Handler, server worker, or backend proxy when one is available.

## Environment variables

Create a local environment file based on the repo example:

```bash
cp .env.example .env.local
```

Required / recommended variables:

```bash
HERMES_BASE_URL=https://hermes.example.com
HERMES_ROUTER_PATH=/api/v1/agent-router/route
HERMES_STATUS_PATH=/api/v1/agent-router/jobs
HERMES_API_KEY=your-bearer-token
HERMES_TIMEOUT_MS=15000
```

## Contract

### Request payload

```ts
{
  intent: "summarize-workflow",
  payload: {
    title: "Create weekly operations summary",
    priority: "high"
  },
  tenantId: "tenant-demo",
  userId: "copilot-user",
  source: "copilot",
  metadata: {
    channel: "github-copilot"
  }
}
```

### Response contract

```ts
{
  status: "success" | "pending" | "failed",
  request_id: "req-123",
  trace_id: "req-123-trace",
  correlation_id: "corr-456",
  message: "Hermes processed the request successfully.",
  result: { ... },
  error: null | {
    code: "HERMES_REQUEST_FAILED",
    message: "The request was rejected by Hermes.",
    retryable: true
  },
  retry_after_seconds: 5
}
```

## Security

- HTTPS is required for `HERMES_BASE_URL`.
- Authentication uses `Authorization: Bearer <token>`.
- Idempotency is enforced with `Idempotency-Key` and `requestId`.
- Sensitive values must stay in environment secrets, not in source control.
- All logs should include a trace ID and tenant ID.

## Failure handling

The adapter handles three primary outcomes:

1. Configuration error
   - Missing `HERMES_BASE_URL` or non-HTTPS URL.
   - Result: `failed` with `HERMES_CONFIG_ERROR`.

2. Request error
   - Hermes rejects the payload or returns non-2xx.
   - Result: `failed` with structured `error` object and `retryable` flag.

3. Transport error / timeout
   - Request times out or network connection fails.
   - Result: `failed` with `HERMES_TRANSPORT_ERROR` and `retryable: true`.

## Status polling

Use `getHermesStatus(requestId)` to fetch the final state of a long-running workflow.

## Checklist for staging

- [ ] Set `HERMES_BASE_URL` with HTTPS.
- [ ] Configure `HERMES_API_KEY` in the runtime secret manager.
- [ ] Confirm route path exists on Hermes.
- [ ] Validate request ID and idempotency key behavior.
- [ ] Verify retry and DLQ behavior for non-2xx responses.
- [ ] Confirm logs contain request ID, trace ID, tenant ID, and status.
- [ ] Run smoke tests with a valid tenant and a failing tenant.

## Usage

```ts
import { sendToHermes } from "@/lib/server/hermes";

const response = await sendToHermes({
  intent: "summarize-workflow",
  payload: {
    title: "Weekly report",
    priority: "high",
  },
  tenantId: "tenant-demo",
  userId: "copilot-user",
  source: "copilot",
});

console.log(response.status, response.request_id);
```
