import assert from "node:assert/strict";
import test from "node:test";

import { registerAccount } from "../lib/auth/registration.js";

test("registerAccount creates a verification token and sends it by email", async () => {
  const calls = [];
  const user = {
    id: 42,
    email: "customer@example.com",
    name: "Customer",
    role: "customer",
    emailVerified: false,
  };

  const result = await registerAccount(
    { email: " Customer@Example.com ", name: "Customer", password: "correct horse" },
    {
      findUserByEmail: async (email) => {
        calls.push(["find", email]);
        return null;
      },
      createUser: async (input) => {
        calls.push(["create", input.email]);
        return user;
      },
      createVerificationToken: async () => {
        calls.push(["token"]);
        return "verification-token";
      },
      sendVerificationEmail: async (message) => {
        calls.push(["email", message]);
        return { messageId: "message-1" };
      },
      writeAuditLog: async (entry) => calls.push(["audit", entry.action]),
    },
  );

  assert.equal(result.user, user);
  assert.equal(result.verificationEmailSent, true);
  assert.deepEqual(calls[0], ["find", "customer@example.com"]);
  assert.deepEqual(calls[1], ["create", "customer@example.com"]);
  assert.deepEqual(calls[2], ["token"]);
  assert.equal(calls[3][0], "email");
  assert.equal(calls[3][1].token, "verification-token");
  assert.deepEqual(calls.at(-1), ["audit", "register"]);
});

test("registerAccount keeps the account and reports email delivery failure", async () => {
  const audits = [];
  const user = {
    id: 43,
    email: "customer@example.com",
    name: "Customer",
    role: "customer",
    emailVerified: false,
  };

  const result = await registerAccount(
    { email: user.email, name: user.name, password: "correct horse" },
    {
      findUserByEmail: async () => null,
      createUser: async () => user,
      createVerificationToken: async () => "verification-token",
      sendVerificationEmail: async () => {
        throw new Error("SMTP unavailable");
      },
      writeAuditLog: async (entry) => audits.push(entry.action),
    },
  );

  assert.equal(result.user, user);
  assert.equal(result.verificationEmailSent, false);
  assert.deepEqual(audits, ["verification_email_failed", "register"]);
});
