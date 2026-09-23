import { withConnection } from "@/lib/auth/db.js";
import { listAdminProducts, saveAdminProduct } from "@/lib/admin/data.js";
import { parseJsonBody, runAdminApi } from "@/lib/admin/route-helpers.js";

export const dynamic = "force-dynamic";

export async function GET(request) {
  return runAdminApi(request, async () => {
    const url = new URL(request.url);
    const products = await withConnection((connection) =>
      listAdminProducts(connection, {
        status: url.searchParams.get("status") || undefined,
        q: url.searchParams.get("q") || undefined,
        locale: url.searchParams.get("locale") || "en",
      }),
    );
    return { products };
  });
}

export async function POST(request) {
  return runAdminApi(
    request,
    async () => {
      const body = await parseJsonBody(request);
      const productId = await withConnection((connection) => saveAdminProduct(connection, body));
      return { productId };
    },
    { requireOrigin: true },
  );
}
