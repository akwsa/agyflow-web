import { AuthInputError } from "./registration.js";

export async function requestPasswordReset(email, dependencies) {
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  const user = await dependencies.findUserByEmail(normalizedEmail);
  if (!user) return { accepted: true };

  const token = await dependencies.createVerificationToken(user, "password_reset", 1);
  try {
    await dependencies.sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      token,
    });
    await dependencies.writeAuditLog({
      userId: user.id,
      action: "password_reset_requested",
    });
  } catch {
    // Never surface delivery failure to the caller: doing so would leak that the
    // address exists. Record the failure and still return the neutral response.
    await dependencies.writeAuditLog({
      userId: user.id,
      action: "password_reset_email_failed",
    });
  }

  return { accepted: true };
}

export async function confirmPasswordReset(token, password, dependencies) {
  if (String(password ?? "").length < 8) {
    throw new AuthInputError("weak_password", "Password must be at least 8 characters");
  }

  const passwordHash = await dependencies.hashPassword(password);
  const user = await dependencies.resetPasswordWithToken(token, passwordHash);
  if (!user) {
    throw new AuthInputError(
      "invalid_or_expired_token",
      "The password reset link is invalid or has expired",
    );
  }

  await dependencies.writeAuditLog({
    userId: user.id,
    action: "password_reset_completed",
  });
  return user;
}
