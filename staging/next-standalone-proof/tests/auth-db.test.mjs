import assert from "node:assert/strict";
import test from "node:test";

import {
  createSession,
  createUser,
  createVerificationToken,
  getSession,
  resetPasswordWithToken,
  verifyCredentials,
  withConnection,
} from "../lib/auth/db.js";
import { hashPassword } from "../lib/auth/crypto.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for the auth database integration test");
}

test("password reset token changes the password once and revokes existing sessions", async () => {
  const email = `reset-${Date.now()}@example.invalid`;
  let user;

  try {
    user = await createUser({ email, name: "Reset Test", password: "old password" });
    const session = await createSession(user);
    const token = await createVerificationToken(user, "password_reset", 1);
    const passwordHash = await hashPassword("new password");

    const resetUser = await resetPasswordWithToken(token, passwordHash);

    assert.equal(resetUser.id, user.id);
    assert.equal(await verifyCredentials(email, "old password"), null);
    assert.equal((await verifyCredentials(email, "new password")).id, user.id);
    assert.equal(await getSession(session.token), null);
    assert.equal(await resetPasswordWithToken(token, passwordHash), null);
  } finally {
    if (user) {
      await withConnection((connection) =>
        connection.execute("DELETE FROM users WHERE id = ?", [user.id]),
      );
    }
  }
});
