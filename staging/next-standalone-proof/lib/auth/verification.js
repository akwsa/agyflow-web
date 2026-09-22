export async function resendVerificationEmail(user, dependencies) {
  if (user.emailVerified) {
    return { sent: false, alreadyVerified: true };
  }

  const token = await dependencies.createVerificationToken(user);
  await dependencies.sendVerificationEmail({
    to: user.email,
    name: user.name,
    token,
  });
  await dependencies.writeAuditLog({
    userId: user.id,
    action: "verification_email_resent",
  });
  return { sent: true };
}
