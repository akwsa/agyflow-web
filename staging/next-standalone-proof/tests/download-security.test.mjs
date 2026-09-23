import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  DownloadTokenError,
  resolveProtectedDownload,
} from "../lib/downloads/secure-download.js";
import { hashDownloadToken } from "../lib/payments/webhook-utils.js";

function futureDate() {
  return new Date(Date.now() + 60_000).toISOString();
}

function pastDate() {
  return new Date(Date.now() - 60_000).toISOString();
}

function fakeConnection(row) {
  const calls = [];
  return {
    calls,
    async beginTransaction() {
      calls.push({ method: "beginTransaction" });
    },
    async commit() {
      calls.push({ method: "commit" });
    },
    async rollback() {
      calls.push({ method: "rollback" });
    },
    async execute(sql, params = []) {
      calls.push({ method: "execute", sql, params });
      if (sql.includes("FOR UPDATE")) return [[row].filter(Boolean)];
      if (sql.includes("UPDATE download_tokens")) return [{ affectedRows: 1 }];
      return [[]];
    },
  };
}

function tokenRow(overrides = {}) {
  return {
    id: 11,
    token_hash: hashDownloadToken("valid-token"),
    expires_at: futureDate(),
    max_downloads: 3,
    download_count: 1,
    revoked_at: null,
    entitlement_status: "active",
    entitlement_expires_at: null,
    stored_path: "gdpr-checklist.zip",
    download_filename: "gdpr-checklist.zip",
    mime_type: "application/zip",
    ...overrides,
  };
}

test("valid token reads a file from the protected storage root and increments quota", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "agyflow-download-"));
  try {
    await writeFile(path.join(root, "gdpr-checklist.zip"), "zip-bytes");
    const connection = fakeConnection(tokenRow());

    const result = await resolveProtectedDownload({
      connection,
      token: "valid-token",
      productFilesDir: root,
    });

    assert.equal(result.status, "ok");
    assert.equal(result.filename, "gdpr-checklist.zip");
    assert.equal(result.mimeType, "application/zip");
    assert.equal(result.body.toString(), "zip-bytes");
    assert.ok(connection.calls.some((call) => call.sql?.includes("download_count = download_count + 1")));
    assert.ok(connection.calls.some((call) => call.method === "commit"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("invalid token fails with 404 and does not increment quota", async () => {
  const connection = fakeConnection(null);

  await assert.rejects(
    () => resolveProtectedDownload({ connection, token: "missing", productFilesDir: os.tmpdir() }),
    (error) => error instanceof DownloadTokenError && error.statusCode === 404 && error.code === "invalid_token",
  );

  assert.equal(connection.calls.some((call) => call.sql?.includes("UPDATE download_tokens")), false);
  assert.ok(connection.calls.some((call) => call.method === "rollback"));
});

test("expired token fails with 403 and does not increment quota", async () => {
  const connection = fakeConnection(tokenRow({ expires_at: pastDate() }));

  await assert.rejects(
    () => resolveProtectedDownload({ connection, token: "valid-token", productFilesDir: os.tmpdir() }),
    (error) => error instanceof DownloadTokenError && error.statusCode === 403 && error.code === "token_expired",
  );

  assert.equal(connection.calls.some((call) => call.sql?.includes("UPDATE download_tokens")), false);
});

test("quota reached fails with 403 and does not increment quota", async () => {
  const connection = fakeConnection(tokenRow({ download_count: 3, max_downloads: 3 }));

  await assert.rejects(
    () => resolveProtectedDownload({ connection, token: "valid-token", productFilesDir: os.tmpdir() }),
    (error) => error instanceof DownloadTokenError && error.statusCode === 403 && error.code === "quota_reached",
  );

  assert.equal(connection.calls.some((call) => call.sql?.includes("UPDATE download_tokens")), false);
});

test("entitlement must be active and storage paths cannot escape the protected root", async () => {
  const inactive = fakeConnection(tokenRow({ entitlement_status: "revoked" }));
  await assert.rejects(
    () => resolveProtectedDownload({ connection: inactive, token: "valid-token", productFilesDir: os.tmpdir() }),
    (error) => error instanceof DownloadTokenError && error.statusCode === 403 && error.code === "entitlement_inactive",
  );

  const escaping = fakeConnection(tokenRow({ stored_path: "../secret.zip" }));
  await assert.rejects(
    () => resolveProtectedDownload({ connection: escaping, token: "valid-token", productFilesDir: os.tmpdir() }),
    (error) => error instanceof DownloadTokenError && error.statusCode === 500 && error.code === "unsafe_file_path",
  );
});
