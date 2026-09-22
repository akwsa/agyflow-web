import { guardAuthRequest } from "@/lib/auth/auth-request-guard.js";
import { logout } from "@/lib/auth/session.js";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const blocked = await guardAuthRequest(request, {
    scope: "logout",
    limit: 30,
    windowSeconds: 15 * 60,
  });
  if (blocked) return blocked;

  await logout();
  return Response.json({ status: "ok" });
}
