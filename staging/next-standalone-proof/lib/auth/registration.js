export async function registerAccount(input, dependencies) {
  const normalizedEmail = String(input.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new AuthInputError("invalid_email", "Enter a valid email address");
  }
  if (String(input.password ?? "").length < 8) {
    throw new AuthInputError("weak_password", "Password must be at least 8 characters");
  }

  const existing = await dependencies.findUserByEmail(normalizedEmail);
  if (existing) {
    throw new AuthInputError("email_taken", "An account with this email already exists");
  }

  const user = await dependencies.createUser({
    email: normalizedEmail,
    name: String(input.name ?? "").trim(),
    password: String(input.password),
  });
  const token = await dependencies.createVerificationToken(user);
  let verificationEmailSent = true;
  try {
    await dependencies.sendVerificationEmail({
      to: user.email,
      name: user.name,
      token,
    });
    await dependencies.writeAuditLog({ userId: user.id, action: "verification_email_sent" });
  } catch {
    verificationEmailSent = false;
    await dependencies.writeAuditLog({ userId: user.id, action: "verification_email_failed" });
  }
  await dependencies.writeAuditLog({ userId: user.id, action: "register" });

  return { user, verificationEmailSent };
}

export class AuthInputError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "AuthInputError";
    this.code = code;
  }
}
