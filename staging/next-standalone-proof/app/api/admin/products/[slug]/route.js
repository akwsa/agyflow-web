import { withConnection } from "@/lib/auth/db.js";
import { deleteAdminProduct, saveAdminProduct } from "@/lib/admin/data.js";
import { parseJsonBody, runAdminApi } from "@/lib/admin/route-helpers.js";

export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  return runAdminApi(
    request,
    async () => {
      const body = await parseJsonBody(request);
      const productId = await withConnection((connection) =>
        saveAdminProduct(connection, { ...body, slug: params.slug }),
      );
      return { productId };
    },
    { requireOrigin: true },
  );
}

export async function DELETE(request, { params }) {
  return runAdminApi(
    request,
    async () => {
      const deleted = await withConnection((connection) => deleteAdminProduct(connection, params.slug));
      return { deleted };
    },
    { requireOrigin: true },
  );
}
