function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function authLink(baseUrl, path, token) {
  const url = new URL(path, baseUrl);
  url.searchParams.set("token", token);
  return url.toString();
}

export function createAuthEmailService({ transport, baseUrl, from }) {
  if (!transport?.sendMail) throw new Error("Email transport is required");
  if (!baseUrl) throw new Error("APP_BASE_URL is required");
  if (!from) throw new Error("SMTP_FROM is required");

  return {
    async sendVerificationEmail({ to, name, token }) {
      const link = authLink(baseUrl, "/verify-email", token);
      const safeName = escapeHtml(name || "there");
      return transport.sendMail({
        from,
        to,
        subject: "Verify your Agyflow email address",
        text: `Hello ${name || "there"},\n\nVerify your email address by opening this one-time link:\n${link}\n\nThis link expires in 24 hours. If you did not create an Agyflow account, you can ignore this email.`,
        html: `<p>Hello ${safeName},</p><p>Verify your email address by opening this one-time link:</p><p><a href="${escapeHtml(link)}">Verify email address</a></p><p>This link expires in 24 hours. If you did not create an Agyflow account, you can ignore this email.</p>`,
      });
    },
    async sendPasswordResetEmail({ to, name, token }) {
      const link = authLink(baseUrl, "/reset-password", token);
      const safeName = escapeHtml(name || "there");
      return transport.sendMail({
        from,
        to,
        subject: "Reset your Agyflow password",
        text: `Hello ${name || "there"},\n\nReset your password by opening this one-time link:\n${link}\n\nThis link expires in 1 hour. If you did not request a password reset, you can ignore this email.`,
        html: `<p>Hello ${safeName},</p><p>Reset your password by opening this one-time link:</p><p><a href="${escapeHtml(link)}">Reset password</a></p><p>This link expires in 1 hour. If you did not request a password reset, you can ignore this email.</p>`,
      });
    },
  };
}
