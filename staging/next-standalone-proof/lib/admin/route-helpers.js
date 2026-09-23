import { AuthInputError, requireAdmin } from "@/lib/auth/session.js";
import { RequestSecurityError, assertSameOrigin } from "@/lib/auth/request-security.js";

export async function runAdminApi(request, handler, { requireOrigin = false } = {}) {
  try {
    if (requireOrigin && process.env.APP_BASE_URL) {
      assertSameOrigin(request, process.env.APP_BASE_URL);
    }
    const admin = await requireAdmin();
    const result = await handler(admin);
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
    if (error instanceof RequestSecurityError) {
      return Response.json(
        { status: "error", code: error.code, error: error.message },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }
    if (Number.isInteger(error?.statusCode)) {
      return Response.json(
        { status: "error", error: error.message },
        { status: error.statusCode, headers: { "Cache-Control": "no-store" } },
      );
    }
    console.error("admin api failed", error);
    return Response.json(
      { status: "error", error: "Admin request failed" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function parseJsonBody(request) {
  try {
    return await request.json();
  } catch {
    const error = new Error("Invalid JSON body");
    error.statusCode = 400;
    throw error;
  }
}
