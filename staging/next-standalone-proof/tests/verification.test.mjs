import assert from "node:assert/strict";
import test from "node:test";

import { resendVerificationEmail } from "../lib/auth/verification.js";

test("resend verification creates a fresh token for an unverified user", async () => {
  const calls = [];
  const user = {
    id: 5,
    email: "customer@example.com",
    name: "Customer",
    emailVerified: false,
  };

  const result = await resendVerificationEmail(user, {
    createVerificationToken: async (value) => {
      calls.push(["token", value.id]);
      return "fresh-token";
    },
    sendVerificationEmail: async (message) => {
      calls.push(["email", message]);
    },
    writeAuditLog: async (entry) => {
      calls.push(["audit", entry]);
    },
  });

  assert.deepEqual(result, { sent: true });
  assert.deepEqual(calls[0], ["token", 5]);
  assert.equal(calls[1][1].token, "fresh-token");
  assert.equal(calls[2][1].action, "verification_email_resent");
});

test("resend verification does not issue a token for a verified user", async () => {
  let called = false;
  const result = await resendVerificationEmail(
    { id: 6, emailVerified: true },
    {
      createVerificationToken: async () => {
        called = true;
      },
    },
  );

  assert.deepEqual(result, { sent: false, alreadyVerified: true });
  assert.equal(called, false);
});
