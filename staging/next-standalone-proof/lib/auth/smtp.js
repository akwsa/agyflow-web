import nodemailer from "nodemailer";

import { createAuthEmailService } from "./email.js";
import { smtpConfigFromEnv } from "./smtp-config.js";

export function createSmtpEmailService({
  env = process.env,
  createTransport = nodemailer.createTransport,
} = {}) {
  const config = smtpConfigFromEnv(env);
  const transport = createTransport(config.transport);
  return createAuthEmailService({
    transport,
    baseUrl: config.baseUrl,
    from: config.from,
  });
}

let emailService;

export function getAuthEmailService() {
  if (!emailService) emailService = createSmtpEmailService();
  return emailService;
}
