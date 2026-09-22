import "server-only";

import { cookies } from "next/headers";

import { requireRole, requireUser } from "./authorization.js";
import {
  consumeVerificationToken,
  createSession,
  createUser,
  createVerificationToken,
  findUserByEmail,
  getSession,
  resetPasswordWithToken,
  revokeSession,
  verifyCredentials,
  writeAuditLog,
} from "./db.js";
import { hashPassword } from "./crypto.js";
import {
  confirmPasswordReset,
  requestPasswordReset,
} from "./password-reset.js";
import { AuthInputError, registerAccount } from "./registration.js";
import { getAuthEmailService } from "./smtp.js";
import { resendVerificationEmail } from "./verification.js";

const SESSION_COOKIE = "agyflow_session";
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function cookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}

export async function getSessionUser() {
  if (process.env.NEXT_PHASE === "phase-production-build") return null;
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await getSession(token);
  return session?.user ?? null;
}

export async function register({ email, name, password }) {
  const emailService = getAuthEmailService();
  const result = await registerAccount(
    { email, name, password },
    {
      findUserByEmail,
      createUser,
      createVerificationToken,
      sendVerificationEmail: (message) => emailService.sendVerificationEmail(message),
      writeAuditLog,
    },
  );

  await setSessionCookie(result.user);
  return result;
}

export async function login(email, password) {
  const user = await verifyCredentials(email, password);
  if (!user) {
    await writeAuditLog({
      userId: null,
      action: "login_failed",
      detail: { email },
    });
    throw new AuthInputError("invalid_credentials", "Wrong email or password");
  }

  await writeAuditLog({ userId: user.id, action: "login" });
  await setSessionCookie(user);
  return user;
}

export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await revokeSession(token);
  }
  cookieStore.delete(SESSION_COOKIE);
}

async function setSessionCookie(user) {
  const session = await createSession(user);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session.token, cookieOptions());
}

export async function verifyEmail(token) {
  const user = await consumeVerificationToken(token);
  if (!user) return null;
  await writeAuditLog({ userId: user.id, action: "email_verified" });
  return user;
}

export async function sendPasswordReset(email) {
  const emailService = getAuthEmailService();
  return requestPasswordReset(email, {
    findUserByEmail,
    createVerificationToken,
    sendPasswordResetEmail: (message) => emailService.sendPasswordResetEmail(message),
    writeAuditLog,
  });
}

export async function resetPassword(token, password) {
  return confirmPasswordReset(token, password, {
    hashPassword,
    resetPasswordWithToken,
    writeAuditLog,
  });
}

export async function resendVerification() {
  const user = requireUser(await getSessionUser());
  const emailService = getAuthEmailService();
  return resendVerificationEmail(user, {
    createVerificationToken,
    sendVerificationEmail: (message) => emailService.sendVerificationEmail(message),
    writeAuditLog,
  });
}

export async function requireAdmin() {
  return requireRole(await getSessionUser(), "admin");
}

export { AuthInputError };
