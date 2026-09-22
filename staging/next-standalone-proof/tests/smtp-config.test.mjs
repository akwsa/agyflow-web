import assert from "node:assert/strict";
import test from "node:test";

import { smtpConfigFromEnv } from "../lib/auth/smtp-config.js";

test("SMTP configuration requires credentials and enables TLS on port 465", () => {
  const config = smtpConfigFromEnv({
    SMTP_HOST: "mail.agyflow.com",
    SMTP_PORT: "465",
    SMTP_SECURE: "true",
    SMTP_USER: "noreply@agyflow.com",
    SMTP_PASSWORD: "secret",
    SMTP_FROM: "Agyflow <noreply@agyflow.com>",
    APP_BASE_URL: "https://staging.agyflow.com",
  });

  assert.deepEqual(config.transport, {
    host: "mail.agyflow.com",
    port: 465,
    secure: true,
    auth: { user: "noreply@agyflow.com", pass: "secret" },
  });
  assert.equal(config.from, "Agyflow <noreply@agyflow.com>");
  assert.equal(config.baseUrl, "https://staging.agyflow.com");
});

test("SMTP configuration rejects missing required values", () => {
  assert.throws(() => smtpConfigFromEnv({}), /SMTP_HOST/);
});
