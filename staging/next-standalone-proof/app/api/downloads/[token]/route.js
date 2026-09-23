import { withConnection } from "@/lib/auth/db.js";
import {
  DownloadTokenError,
  downloadHeaders,
  resolveProtectedDownload,
} from "@/lib/downloads/secure-download.js";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const result = await withConnection((connection) =>
      resolveProtectedDownload({
        connection,
        token: params.token,
        productFilesDir: process.env.PRODUCT_FILES_DIR,
      }),
    );

    return new Response(result.body, { headers: downloadHeaders(result) });
  } catch (error) {
    if (error instanceof DownloadTokenError) {
      return Response.json(
        { status: "error", code: error.code, error: error.message },
        { status: error.statusCode, headers: { "Cache-Control": "no-store" } },
      );
    }

    console.error("download failed", error);
    return Response.json(
      { status: "error", error: "Download failed" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
