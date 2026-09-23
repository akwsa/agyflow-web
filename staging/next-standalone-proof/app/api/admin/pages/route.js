import { withConnection } from "@/lib/auth/db.js";
import { listCmsPages, saveCmsPage } from "@/lib/admin/data.js";
import { parseJsonBody, runAdminApi } from "@/lib/admin/route-helpers.js";

export const dynamic = "force-dynamic";

export async function GET(request) {
  return runAdminApi(request, async () => {
    const url = new URL(request.url);
    const pages = await withConnection((connection) =>
      listCmsPages(connection, { locale: url.searchParams.get("locale") || undefined }),
    );
    return { pages };
  });
}

export async function POST(request) {
  return runAdminApi(
    request,
    async () => {
      const body = await parseJsonBody(request);
      const pageId = await withConnection((connection) => saveCmsPage(connection, body));
      return { pageId };
    },
    { requireOrigin: true },
  );
}
