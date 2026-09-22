import assert from "node:assert/strict";
import test from "node:test";

import { incrementRateLimit, withConnection } from "../lib/auth/db.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for the rate-limit database integration test");
}

test("rate-limit counter increments atomically for one window", async () => {
  const scope = `test-${Date.now()}`;
  const identifierHash = "a".repeat(64);
  const entry = {
    scope,
    identifierHash,
    windowStart: 1_800,
    windowSeconds: 900,
  };

  try {
    assert.equal(await incrementRateLimit(entry), 1);
    assert.equal(await incrementRateLimit(entry), 2);
  } finally {
    await withConnection((connection) =>
      connection.execute("DELETE FROM auth_rate_limits WHERE scope = ?", [scope]),
    );
  }
});
