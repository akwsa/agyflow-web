import { guardAuthRequest } from "@/lib/auth/auth-request-guard.js";
import { AuthInputError, resendVerification } from "@/lib/auth/session.js";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const blocked = await guardAuthRequest(request, {
    scope: "resend-verification",
    limit: 5,
    windowSeconds: 60 * 60,
  });
  if (blocked) return blocked;

  try {
    const result = await resendVerification();
    return Response.json({ status: "ok", ...result });
  } catch (error) {
    if (error instanceof AuthInputError) {
      return Response.json(
        { status: "error", code: error.code, error: error.message },
        { status: 401 },
      );
    }
    console.error("resend verification failed", error);
    return Response.json(
      { status: "error", error: "Verification email could not be sent" },
      { status: 500 },
    );
  }
}
