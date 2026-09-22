import assert from "node:assert/strict";
import test from "node:test";

import { createAuthEmailService } from "../lib/auth/email.js";

test("verification email sends a one-time HTTPS link from the configured sender", async () => {
  const sent = [];
  const service = createAuthEmailService({
    baseUrl: "https://staging.agyflow.com/",
    from: "Agyflow <noreply@agyflow.com>",
    transport: {
      async sendMail(message) {
        sent.push(message);
        return { messageId: "test-message" };
      },
    },
  });

  const result = await service.sendVerificationEmail({
    to: "customer@example.com",
    name: "Customer",
    token: "token with spaces",
  });

  assert.equal(result.messageId, "test-message");
  assert.equal(sent.length, 1);
  assert.equal(sent[0].from, "Agyflow <noreply@agyflow.com>");
  assert.equal(sent[0].to, "customer@example.com");
  assert.match(sent[0].subject, /verify/i);
  const link = sent[0].text.match(/https:\/\/\S+/)?.[0];
  assert.ok(link);
  const parsed = new URL(link);
  assert.equal(parsed.origin, "https://staging.agyflow.com");
  assert.equal(parsed.pathname, "/verify-email");
  assert.equal(parsed.searchParams.get("token"), "token with spaces");
  assert.match(sent[0].html, /Customer/);
  assert.doesNotMatch(sent[0].html, /<script/i);
});

test("password reset email sends a one-time reset link", async () => {
  const sent = [];
  const service = createAuthEmailService({
    baseUrl: "https://staging.agyflow.com",
    from: "Agyflow <noreply@agyflow.com>",
    transport: {
      async sendMail(message) {
        sent.push(message);
        return { messageId: "reset-message" };
      },
    },
  });

  await service.sendPasswordResetEmail({
    to: "customer@example.com",
    name: "Customer",
    token: "reset-token",
  });

  assert.match(sent[0].subject, /reset/i);
  const link = sent[0].text.match(/https:\/\/\S+/)?.[0];
  assert.ok(link);
  const parsed = new URL(link);
  assert.equal(parsed.pathname, "/reset-password");
  assert.equal(parsed.searchParams.get("token"), "reset-token");
  assert.match(sent[0].text, /expires in 1 hour/i);
});
