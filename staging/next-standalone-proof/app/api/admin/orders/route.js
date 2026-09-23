import { withConnection } from "@/lib/auth/db.js";
import { listAdminOrders } from "@/lib/admin/data.js";
import { runAdminApi } from "@/lib/admin/route-helpers.js";

export const dynamic = "force-dynamic";

export async function GET(request) {
  return runAdminApi(request, async () => {
    const url = new URL(request.url);
    const orders = await withConnection((connection) =>
      listAdminOrders(connection, {
        status: url.searchParams.get("status") || undefined,
        provider: url.searchParams.get("provider") || undefined,
      }),
    );
    return { orders };
  });
}
