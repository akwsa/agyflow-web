import { guardAuthRequest } from "@/lib/auth/auth-request-guard.js";
import { login, AuthInputError } from "@/lib/auth/session.js";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const blocked = await guardAuthRequest(request, {
    scope: "login",
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

  const email = String(body.email ?? "");
  const password = String(body.password ?? "");

  try {
    const user = await login(email, password);
    return Response.json({
      status: "ok",
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    if (error instanceof AuthInputError) {
      return Response.json({ status: "error", code: error.code, error: error.message }, { status: 401 });
    }
    console.error("login failed", error);
    return Response.json({ status: "error", error: "Login failed" }, { status: 500 });
  }
}
