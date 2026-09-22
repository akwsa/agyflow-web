import assert from "node:assert/strict";
import test from "node:test";

import { createSmtpEmailService } from "../lib/auth/smtp.js";

test("runtime SMTP service creates transport and exposes verification delivery", async () => {
  const calls = [];
  const service = createSmtpEmailService({
    env: {
      SMTP_HOST: "mail.agyflow.com",
      SMTP_PORT: "465",
      SMTP_SECURE: "true",
      SMTP_USER: "noreply@agyflow.com",
      SMTP_PASSWORD: "secret",
      SMTP_FROM: "Agyflow <noreply@agyflow.com>",
      APP_BASE_URL: "https://staging.agyflow.com",
    },
    createTransport(options) {
      calls.push({ type: "transport", options });
      return {
        async sendMail(message) {
          calls.push({ type: "message", message });
          return { messageId: "runtime-test" };
        },
      };
    },
  });

  const result = await service.sendVerificationEmail({
    to: "customer@example.com",
    name: "Customer",
    token: "one-time-token",
  });

  assert.equal(result.messageId, "runtime-test");
  assert.equal(calls[0].options.host, "mail.agyflow.com");
  assert.equal(calls[0].options.secure, true);
  assert.equal(calls[1].message.to, "customer@example.com");
});
