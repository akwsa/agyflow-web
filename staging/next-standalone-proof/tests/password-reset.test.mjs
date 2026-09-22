import assert from "node:assert/strict";
import test from "node:test";

import { confirmPasswordReset, requestPasswordReset } from "../lib/auth/password-reset.js";

function dependenciesFor(user) {
  const calls = [];
  return {
    calls,
    dependencies: {
      findUserByEmail: async (email) => {
        calls.push(["find", email]);
        return user;
      },
      createVerificationToken: async (...args) => {
        calls.push(["token", ...args]);
        return "reset-token";
      },
      sendPasswordResetEmail: async (message) => calls.push(["email", message]),
      writeAuditLog: async (entry) => calls.push(["audit", entry.action]),
    },
  };
}

test("password reset request emails a one-hour token for an existing user", async () => {
  const user = {
    id: 42,
    email: "customer@example.com",
    name: "Customer",
  };
  const { calls, dependencies } = dependenciesFor(user);

  const result = await requestPasswordReset(" Customer@Example.com ", dependencies);

  assert.deepEqual(result, { accepted: true });
  assert.deepEqual(calls[0], ["find", "customer@example.com"]);
  assert.equal(calls[1][0], "token");
  assert.equal(calls[1][2], "password_reset");
  assert.equal(calls[1][3], 1);
  assert.equal(calls[2][0], "email");
  assert.equal(calls[2][1].token, "reset-token");
  assert.deepEqual(calls.at(-1), ["audit", "password_reset_requested"]);
});

test("password reset request returns the same result for an unknown user", async () => {
  const { calls, dependencies } = dependenciesFor(null);

  const result = await requestPasswordReset("missing@example.com", dependencies);

  assert.deepEqual(result, { accepted: true });
  assert.deepEqual(calls, [["find", "missing@example.com"]]);
});

test("password reset request stays enumeration-safe when email delivery fails", async () => {
  const user = { id: 7, email: "customer@example.com", name: "Customer" };
  const calls = [];
  const dependencies = {
    findUserByEmail: async () => user,
    createVerificationToken: async () => "reset-token",
    sendPasswordResetEmail: async () => {
      throw new Error("550 No Such User Here");
    },
    writeAuditLog: async (entry) => calls.push(entry.action),
  };

  const result = await requestPasswordReset("customer@example.com", dependencies);

  assert.deepEqual(result, { accepted: true });
  assert.ok(calls.includes("password_reset_email_failed"));
});

test("password reset confirmation hashes the password and revokes old sessions", async () => {
  const calls = [];
  const user = { id: 42, email: "customer@example.com" };

  const result = await confirmPasswordReset("reset-token", "new password", {
    hashPassword: async (password) => {
      calls.push(["hash", password]);
      return "new-password-hash";
    },
    resetPasswordWithToken: async (token, passwordHash) => {
      calls.push(["reset", token, passwordHash]);
      return user;
    },
    writeAuditLog: async (entry) => calls.push(["audit", entry.action, entry.userId]),
  });

  assert.equal(result, user);
  assert.deepEqual(calls, [
    ["hash", "new password"],
    ["reset", "reset-token", "new-password-hash"],
    ["audit", "password_reset_completed", 42],
  ]);
});

test("password reset confirmation rejects an invalid or consumed token", async () => {
  await assert.rejects(
    confirmPasswordReset("bad-token", "new password", {
      hashPassword: async () => "new-password-hash",
      resetPasswordWithToken: async () => null,
      writeAuditLog: async () => {},
    }),
    (error) => error.code === "invalid_or_expired_token",
  );
});
