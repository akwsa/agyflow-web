import { withConnection } from "@/lib/auth/db.js";
import { listAdminUsers, setAdminUserRole } from "@/lib/admin/data.js";
import { parseJsonBody, runAdminApi } from "@/lib/admin/route-helpers.js";

export const dynamic = "force-dynamic";

export async function GET(request) {
  return runAdminApi(request, async () => {
    const url = new URL(request.url);
    const users = await withConnection((connection) =>
      listAdminUsers(connection, { role: url.searchParams.get("role") || undefined }),
    );
    return { users };
  });
}

export async function PATCH(request) {
  return runAdminApi(
    request,
    async () => {
      const body = await parseJsonBody(request);
      const updated = await withConnection((connection) =>
        setAdminUserRole(connection, { userId: Number(body.userId), role: String(body.role ?? "") }),
      );
      return { updated };
    },
    { requireOrigin: true },
  );
}
