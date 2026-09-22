// Server-side SMTP proof: verifies the transport with the app's real Passenger
// environment (run through CloudLinux run-script) and sends one real
// verification email to a controlled recipient. Never prints the SMTP password.
// Recipient defaults to the postmaster forwarder for agyflow.com; override with
// SMTP_TEST_RECIPIENT.
import nodemailer from "nodemailer";

import { createAuthEmailService } from "../lib/auth/email.js";
import { smtpConfigFromEnv } from "../lib/auth/smtp-config.js";

const config = smtpConfigFromEnv();
const transporter = nodemailer.createTransport(config.transport);

const verified = await transporter.verify();
console.log(JSON.stringify({ step: "verify", ok: verified === true }));

const service = createAuthEmailService({
  transport: transporter,
  baseUrl: config.baseUrl,
  from: config.from,
});

const recipient = (process.env.SMTP_TEST_RECIPIENT || "postmaster@agyflow.com").trim();
const info = await service.sendVerificationEmail({
  to: recipient,
  name: "SMTP Proof",
  token: "smtp-proof-token-not-real",
});
console.log(
  JSON.stringify({
    step: "send",
    accepted: info.accepted,
    rejected: info.rejected,
    response: info.response,
    messageId: info.messageId,
  }),
);
