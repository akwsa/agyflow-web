import { withConnection } from "@/lib/auth/db.js";
import { listWebhookEvents } from "@/lib/admin/data.js";
import { runAdminApi } from "@/lib/admin/route-helpers.js";

export const dynamic = "force-dynamic";

export async function GET(request) {
  return runAdminApi(request, async () => {
    const url = new URL(request.url);
    const events = await withConnection((connection) =>
      listWebhookEvents(connection, {
        provider: url.searchParams.get("provider") || undefined,
        status: url.searchParams.get("status") || undefined,
      }),
    );
    return { events };
  });
}
