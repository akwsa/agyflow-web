import assert from "node:assert/strict";
import test from "node:test";

import { createAuthRequestGuard } from "../lib/auth/auth-request-guard.js";

test("auth guard rejects a cross-site POST before touching the rate limiter", async () => {
  let consumed = false;
  const guard = createAuthRequestGuard({
    appBaseUrl: "https://staging.agyflow.com",
    limiter: {
      async consume() {
        consumed = true;
        return { allowed: true, limit: 5, remaining: 4, retryAfter: 900 };
      },
    },
  });
  const request = new Request("https://staging.agyflow.com/api/auth/login", {
    method: "POST",
    headers: { origin: "https://attacker.example" },
  });

  const response = await guard(request, {
    scope: "login",
    limit: 5,
    windowSeconds: 900,
  });

  assert.equal(response.status, 403);
  assert.equal(consumed, false);
});

test("auth guard returns 429 with Retry-After when the limit is exceeded", async () => {
  const guard = createAuthRequestGuard({
    appBaseUrl: "https://staging.agyflow.com",
    limiter: {
      async consume() {
        return { allowed: false, limit: 5, remaining: 0, retryAfter: 321 };
      },
    },
  });
  const request = new Request("https://staging.agyflow.com/api/auth/login", {
    method: "POST",
    headers: {
      origin: "https://staging.agyflow.com",
      "x-forwarded-for": "203.0.113.10",
    },
  });

  const response = await guard(request, {
    scope: "login",
    limit: 5,
    windowSeconds: 900,
  });

  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "321");
});

test("auth guard returns null for an allowed same-origin request", async () => {
  const guard = createAuthRequestGuard({
    appBaseUrl: "https://staging.agyflow.com",
    limiter: {
      async consume() {
        return { allowed: true, limit: 5, remaining: 4, retryAfter: 900 };
      },
    },
  });
  const request = new Request("https://staging.agyflow.com/api/auth/login", {
    method: "POST",
    headers: { origin: "https://staging.agyflow.com" },
  });

  assert.equal(
    await guard(request, { scope: "login", limit: 5, windowSeconds: 900 }),
    null,
  );
});
