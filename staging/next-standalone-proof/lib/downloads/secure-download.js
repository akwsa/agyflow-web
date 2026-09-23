import { readFile } from "node:fs/promises";
import path from "node:path";

import { hashDownloadToken } from "../payments/webhook-utils.js";

export class DownloadTokenError extends Error {
  constructor(code, message, statusCode) {
    super(message);
    this.name = "DownloadTokenError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

function isExpired(value) {
  return new Date(String(value)).getTime() <= Date.now();
}

function requireProductFilesRoot(productFilesDir) {
  if (!productFilesDir) {
    throw new DownloadTokenError(
      "storage_not_configured",
      "Protected file storage is not configured",
      500,
    );
  }
  return path.resolve(productFilesDir);
}

function safeProductFilePath(root, storedPath) {
  const relative = String(storedPath ?? "").trim();
  if (!relative || path.isAbsolute(relative)) {
    throw new DownloadTokenError("unsafe_file_path", "Stored file path is not safe", 500);
  }

  const resolved = path.resolve(root, relative);
  const relativeFromRoot = path.relative(root, resolved);
  if (relativeFromRoot.startsWith("..") || path.isAbsolute(relativeFromRoot)) {
    throw new DownloadTokenError("unsafe_file_path", "Stored file path is not safe", 500);
  }
  return resolved;
}

function contentDispositionFilename(filename) {
  return String(filename || "download.bin").replace(/[\r\n"]/g, "_");
}

function validateDownloadRow(row) {
  if (!row) {
    throw new DownloadTokenError("invalid_token", "Invalid download token", 404);
  }
  if (row.revoked_at != null) {
    throw new DownloadTokenError("token_revoked", "Download token has been revoked", 403);
  }
  if (isExpired(row.expires_at)) {
    throw new DownloadTokenError("token_expired", "Download token has expired", 403);
  }
  if (Number(row.download_count ?? 0) >= Number(row.max_downloads ?? 0)) {
    throw new DownloadTokenError("quota_reached", "Download limit reached", 403);
  }
  if (String(row.entitlement_status ?? "") !== "active") {
    throw new DownloadTokenError("entitlement_inactive", "Download entitlement is not active", 403);
  }
  if (row.entitlement_expires_at != null && isExpired(row.entitlement_expires_at)) {
    throw new DownloadTokenError("entitlement_expired", "Download entitlement has expired", 403);
  }
  if (!row.stored_path) {
    throw new DownloadTokenError("file_not_found", "No file is attached to this product", 404);
  }
}

async function loadDownloadRow(connection, token) {
  const tokenHash = hashDownloadToken(token);
  const [rows] = await connection.execute(
    `SELECT dt.id, dt.token_hash, dt.expires_at, dt.max_downloads, dt.download_count,
            dt.revoked_at, e.status AS entitlement_status, e.expires_at AS entitlement_expires_at,
            pf.stored_path, pf.download_filename, pf.mime_type
       FROM download_tokens dt
       JOIN order_items oi ON oi.id = dt.order_item_id
       JOIN entitlements e ON e.source = 'order' AND e.source_id = oi.id
       JOIN product_files pf
         ON (pf.product_id = oi.product_id OR (pf.product_id IS NULL AND pf.product_slug = oi.product_slug))
        AND pf.status = 'active'
      WHERE dt.token_hash = ?
      ORDER BY pf.id ASC
      LIMIT 1
      FOR UPDATE`,
    [tokenHash],
  );
  return rows[0] ?? null;
}

export async function resolveProtectedDownload({ connection, token, productFilesDir }) {
  const root = requireProductFilesRoot(productFilesDir);
  await connection.beginTransaction();

  try {
    const row = await loadDownloadRow(connection, token);
    validateDownloadRow(row);

    const filePath = safeProductFilePath(root, row.stored_path);
    const body = await readFile(filePath);
    await connection.execute(
      `UPDATE download_tokens
          SET download_count = download_count + 1,
              last_download_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
      [row.id],
    );
    await connection.commit();

    return {
      status: "ok",
      body,
      filename: contentDispositionFilename(row.download_filename || path.basename(row.stored_path)),
      mimeType: row.mime_type || "application/octet-stream",
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  }
}

export function downloadHeaders(result) {
  return {
    "Content-Type": result.mimeType,
    "Content-Disposition": `attachment; filename="${result.filename}"`,
    "Content-Length": String(result.body.length),
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
}
