import { guardAuthRequest } from "@/lib/auth/auth-request-guard.js";
import { register, AuthInputError } from "@/lib/auth/session.js";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const blocked = await guardAuthRequest(request, {
    scope: "register",
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

  const email = String(body.email ?? "");
  const name = String(body.name ?? email.split("@")[0] ?? "");
  const password = String(body.password ?? "");

  try {
    const result = await register({ email, name, password });
    const user = result.user;
    return Response.json(
      {
        status: "ok",
        verificationEmailSent: result.verificationEmailSent,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof AuthInputError) {
      return Response.json({ status: "error", code: error.code, error: error.message }, { status: 400 });
    }
    console.error("register failed", error);
    return Response.json({ status: "error", error: "Registration failed" }, { status: 500 });
  }
}
