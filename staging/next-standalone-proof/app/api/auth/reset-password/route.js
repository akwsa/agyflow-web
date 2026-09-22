import { guardAuthRequest } from "@/lib/auth/auth-request-guard.js";
import { AuthInputError, resetPassword } from "@/lib/auth/session.js";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const blocked = await guardAuthRequest(request, {
    scope: "reset-password",
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

  try {
    await resetPassword(String(body.token ?? ""), String(body.password ?? ""));
    return Response.json({ status: "ok" });
  } catch (error) {
    if (error instanceof AuthInputError) {
      return Response.json(
        { status: "error", code: error.code, error: error.message },
        { status: 400 },
      );
    }
    console.error("password reset failed", error);
    return Response.json({ status: "error", error: "Password reset failed" }, { status: 500 });
  }
}
