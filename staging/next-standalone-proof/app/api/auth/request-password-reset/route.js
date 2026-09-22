import { guardAuthRequest } from "@/lib/auth/auth-request-guard.js";
import { sendPasswordReset } from "@/lib/auth/session.js";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const blocked = await guardAuthRequest(request, {
    scope: "request-password-reset",
    limit: 5,
    windowSeconds: 60 * 60,
  });
  if (blocked) return blocked;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ status: "error", error: "Invalid JSON body" }, { status: 400 });
  }

  await sendPasswordReset(String(body.email ?? ""));
  return Response.json({
    status: "ok",
    message: "If an account exists for that email, a reset link has been sent.",
  });
}
