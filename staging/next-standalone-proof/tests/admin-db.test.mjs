import assert from "node:assert/strict";
import test from "node:test";

import { createUser, getAdminOverview, withConnection } from "../lib/auth/db.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

test("admin overview returns real account counts", async () => {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const email = `overview-${suffix}@example.test`;
  const user = await createUser({
    email,
    name: "Overview Test",
    password: "test-password",
  });

  try {
    const overview = await getAdminOverview();
    assert.ok(overview.users.total >= 1);
    assert.ok(overview.users.unverified >= 1);
    assert.equal(typeof overview.sessions.active, "number");
  } finally {
    await withConnection((connection) =>
      connection.execute("DELETE FROM users WHERE id = ?", [user.id]),
    );
  }
});
