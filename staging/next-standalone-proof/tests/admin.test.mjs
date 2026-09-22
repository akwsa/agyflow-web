import assert from "node:assert/strict";
import test from "node:test";

import { loadAdminOverview } from "../lib/auth/admin.js";

test("admin overview combines the authorized user with live counts", async () => {
  const admin = { id: 7, email: "admin@example.com", role: "admin" };
  let guarded = false;

  const result = await loadAdminOverview({
    requireAdmin: async () => {
      guarded = true;
      return admin;
    },
    getAdminOverview: async () => ({
      users: { total: 3, verified: 2, unverified: 1, admins: 1 },
      sessions: { active: 2 },
    }),
  });

  assert.equal(guarded, true);
  assert.equal(result.admin, admin);
  assert.equal(result.overview.users.total, 3);
});
