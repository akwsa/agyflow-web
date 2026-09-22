import { getSessionUser } from "@/lib/auth/session.js";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ status: "error", code: "unauthorized" }, { status: 401 });
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
