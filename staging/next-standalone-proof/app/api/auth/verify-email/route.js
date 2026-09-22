import { guardAuthRequest } from "@/lib/auth/auth-request-guard.js";
import { verifyEmail } from "@/lib/auth/session.js";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const blocked = await guardAuthRequest(request, {
    scope: "verify-email",
    limit: 10,
    windowSeconds: 15 * 60,
  });
  if (blocked) return blocked;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ status: "error", error: "Invalid JSON body" }, { status: 400 });
  }

  const token = String(body.token ?? "");
  if (!token) {
    return Response.json({ status: "error", code: "missing_token" }, { status: 400 });
  }

  const user = await verifyEmail(token);
  if (!user) {
    return Response.json({ status: "error", code: "invalid_or_expired_token" }, { status: 400 });
  }

  return Response.json({
    status: "ok",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.emailVerified,
    },
  });
}
