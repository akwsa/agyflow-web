import { loadAdminOverview } from "@/lib/auth/admin.js";
import { getAdminOverview } from "@/lib/auth/db.js";
import { AuthInputError, requireAdmin } from "@/lib/auth/session.js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await loadAdminOverview({ requireAdmin, getAdminOverview });
    return Response.json(
      { status: "ok", ...result },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof AuthInputError) {
      const status = error.code === "unauthorized" ? 401 : 403;
      return Response.json(
        { status: "error", code: error.code, error: error.message },
        { status, headers: { "Cache-Control": "no-store" } },
      );
    }
    console.error("admin overview failed", error);
    return Response.json(
      { status: "error", error: "Admin overview failed" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
