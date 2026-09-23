import { withConnection } from "@/lib/auth/db.js";
import { createMediaAsset, listMediaAssets } from "@/lib/admin/data.js";
import { parseJsonBody, runAdminApi } from "@/lib/admin/route-helpers.js";

export const dynamic = "force-dynamic";

export async function GET(request) {
  return runAdminApi(request, async () => {
    const url = new URL(request.url);
    const media = await withConnection((connection) =>
      listMediaAssets(connection, { kind: url.searchParams.get("kind") || undefined }),
    );
    return { media };
  });
}

export async function POST(request) {
  return runAdminApi(
    request,
    async (admin) => {
      const body = await parseJsonBody(request);
      const mediaId = await withConnection((connection) =>
        createMediaAsset(connection, { ...body, uploadedBy: admin.id }),
      );
      return { mediaId };
    },
    { requireOrigin: true },
  );
}
