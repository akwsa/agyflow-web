import assert from "node:assert/strict";
import test from "node:test";

import { resetInMemoryRateLimits } from "../lib/rate-limit.js";
import { guardWebhookRequest } from "../lib/payments/webhook-rate-limit.js";

test("webhook guard allows requests within the in-memory window then returns 429", async () => {
  resetInMemoryRateLimits();
  const request = new Request("https://staging.agyflow.com/api/webhooks/lemonsqueezy", {
    method: "POST",
    headers: { "x-forwarded-for": "198.51.100.9" },
  });

  const first = await guardWebhookRequest(request, {
    scope: "webhook:test",
    limit: 2,
    windowSeconds: 60,
  });
  const second = await guardWebhookRequest(request, {
    scope: "webhook:test",
    limit: 2,
    windowSeconds: 60,
  });
  const third = await guardWebhookRequest(request, {
    scope: "webhook:test",
    limit: 2,
    windowSeconds: 60,
  });

  assert.equal(first, null);
  assert.equal(second, null);
  assert.equal(third.status, 429);
  assert.equal(third.headers.get("x-ratelimit-limit"), "2");
  assert.equal(third.headers.get("x-ratelimit-remaining"), "0");
});
