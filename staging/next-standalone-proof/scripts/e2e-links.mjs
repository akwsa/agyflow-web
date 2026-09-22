// End-to-end proof for the emailed links, run server-side with the real DB.
// Tokens are hashed at rest, so we mint real tokens here (the same call the
// email flow uses), then drive the exact consume path each email link triggers:
//   /verify-email?token=...  -> POST /api/auth/verify-email -> consumeVerificationToken
//   /reset-password?token=... -> POST /api/auth/reset-password -> resetPasswordWithToken
// Proves: verify marks the account verified and is single-use; reset changes the
// password, revokes old sessions, and rejects reuse. No secrets are printed.
import {
  consumeVerificationToken,
  createSession,
  createUser,
  createVerificationToken,
  getSession,
  resetPasswordWithToken,
  verifyCredentials,
} from "../lib/auth/db.js";
import { hashPassword } from "../lib/auth/crypto.js";

const stamp = Date.now();
const email = `linkproof+${stamp}@example.com`;
const oldPassword = "OldPass!" + stamp;
const newPassword = "NewPass!" + stamp;
const log = (o) => console.log(JSON.stringify(o));

const user = await createUser({ email, name: "Link Proof", password: oldPassword });

// --- verification link ---
const verifyToken = await createVerificationToken(user, "email_verification", 24);
const verified = await consumeVerificationToken(verifyToken, "email_verification");
const verifyReuse = await consumeVerificationToken(verifyToken, "email_verification");
log({
  step: "verify_link",
  consumed_ok: verified != null && verified.emailVerified === true,
  single_use_ok: verifyReuse === null,
});

// --- open a session, then reset must revoke it ---
const session = await createSession(user);
const resetToken = await createVerificationToken(user, "password_reset", 1);
const newHash = await hashPassword(newPassword);
const resetUser = await resetPasswordWithToken(resetToken, newHash);
const oldSessionAfter = await getSession(session.token);
const reuse = await resetPasswordWithToken(resetToken, newHash);
const oldWorks = await verifyCredentials(email, oldPassword);
const newWorks = await verifyCredentials(email, newPassword);
log({
  step: "reset_link",
  reset_ok: resetUser != null,
  old_session_revoked: oldSessionAfter === null,
  token_reuse_rejected: reuse === null,
  old_password_rejected: oldWorks === null,
  new_password_accepted: newWorks != null,
});
