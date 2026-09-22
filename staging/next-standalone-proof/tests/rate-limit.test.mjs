import assert from "node:assert/strict";
import test from "node:test";

import { createRateLimiter } from "../lib/auth/rate-limit.js";

test("rate limiter hashes identifiers and blocks attempts above the fixed-window limit", async () => {
  const increments = [];
  const limiter = createRateLimiter({
    async increment(entry) {
      increments.push(entry);
      return 3;
    },
  });

  const result = await limiter.consume({
    scope: "login",
    identifier: "203.0.113.10",
    limit: 2,
    windowSeconds: 900,
    now: 1_800_000,
  });

  assert.equal(increments.length, 1);
  assert.equal(increments[0].scope, "login");
  assert.equal(increments[0].identifierHash.length, 64);
  assert.doesNotMatch(increments[0].identifierHash, /203\.0\.113\.10/);
  assert.equal(increments[0].windowStart, 1_800);
  assert.deepEqual(result, {
    allowed: false,
    limit: 2,
    remaining: 0,
    retryAfter: 900,
  });
});

test("rate limiter reports remaining attempts inside the active window", async () => {
  const limiter = createRateLimiter({ increment: async () => 2 });

  const result = await limiter.consume({
    scope: "register",
    identifier: "203.0.113.11",
    limit: 5,
    windowSeconds: 900,
    now: 1_950_000,
  });

  assert.equal(result.allowed, true);
  assert.equal(result.remaining, 3);
  assert.equal(result.retryAfter, 750);
});
