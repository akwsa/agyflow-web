import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { resolveProtectedDownload } from "../lib/downloads/secure-download.js";
import { processLemonSqueezyPayload } from "../lib/payments/webhook-db.js";

function createCustomerFlowConnection() {
  const state = {
    nextOrderId: 101,
    nextOrderItemId: 201,
    productId: 301,
    orders: [],
    orderItems: [],
    downloadTokens: [],
    entitlements: [],
    downloadCount: 0,
  };

  return {
    state,
    async beginTransaction() {},
    async commit() {},
    async rollback() {},
    async execute(sql, params = []) {
      if (sql.includes("SELECT id FROM users WHERE email")) return [[]];
      if (sql.includes("SELECT id FROM products WHERE slug")) return [[{ id: state.productId }]];

      if (sql.includes("INSERT INTO orders")) {
        const existing = state.orders.find((order) => order.provider === params[3] && order.providerOrderId === params[4]);
        if (existing) return [{ insertId: existing.id }];
        state.orders.push({
          id: state.nextOrderId,
          orderNumber: params[0],
          userId: params[1],
          email: params[2],
          provider: params[3],
          providerOrderId: params[4],
          status: params[5],
          totalCents: params[8],
        });
        return [{ insertId: state.nextOrderId++ }];
      }

      if (sql.includes("FROM orders") && sql.includes("provider_order_id")) {
        const order = state.orders.find((item) => item.provider === params[0] && item.providerOrderId === params[1]);
        return [[{ id: order.id, user_id: order.userId }]];
      }

      if (sql.includes("SELECT COUNT(*) AS count FROM order_items")) {
        return [[{ count: state.orderItems.filter((item) => item.orderId === params[0]).length }]];
      }

      if (sql.includes("INSERT INTO order_items")) {
        const id = state.nextOrderItemId++;
        state.orderItems.push({
          id,
          orderId: params[0],
          productId: params[1],
          productSlug: params[2],
          quantity: params[5],
          unitPriceCents: params[6],
        });
        return [{ insertId: id }];
      }

      if (sql.includes("INSERT INTO download_tokens")) {
        state.downloadTokens.push({
          id: state.downloadTokens.length + 1,
          tokenHash: params[0],
          preview: params[1],
          orderItemId: params[2],
          userId: params[3],
          email: params[4],
          expiresAt: params[5],
          maxDownloads: 10,
        });
        return [{ insertId: state.downloadTokens.length }];
      }

      if (sql.includes("INSERT INTO entitlements")) {
        state.entitlements.push({
          userId: params[0],
          email: params[1],
          orderItemId: params[2],
          productId: params[3],
          productSlug: params[4],
          provider: params[5],
          status: "active",
        });
        return [{ insertId: state.entitlements.length }];
      }

      if (sql.includes("FROM download_tokens dt") && sql.includes("FOR UPDATE")) {
        const token = state.downloadTokens[0];
        const entitlement = state.entitlements[0];
        return [[{
          id: token.id,
          token_hash: token.tokenHash,
          expires_at: token.expiresAt,
          max_downloads: token.maxDownloads,
          download_count: state.downloadCount,
          revoked_at: null,
          entitlement_status: entitlement.status,
          entitlement_expires_at: null,
          stored_path: "client-onboarding-kit.zip",
          download_filename: "client-onboarding-kit.zip",
          mime_type: "application/zip",
        }]];
      }

      if (sql.includes("UPDATE download_tokens") && sql.includes("download_count = download_count + 1")) {
        state.downloadCount += 1;
        return [{ affectedRows: 1 }];
      }

      throw new Error(`Unexpected SQL in customer flow test: ${sql}`);
    },
  };
}

function lemonSqueezyCheckoutPayload() {
  return {
    meta: { event_name: "order_created" },
    data: {
      id: "ls-order-9001",
      attributes: {
        status: "paid",
        user_email: "buyer@example.com",
        subtotal: 1900,
        tax: 0,
        total: 1900,
        currency: "USD",
        order_items: [{
          product_name: "Client Onboarding Kit",
          product_slug: "client-onboarding-kit",
          product_id: "prod_123",
          variant_id: "var_123",
          variant_name: "individual",
          quantity: 1,
          price: 1900,
        }],
      },
    },
  };
}

test("full customer flow creates entitlement from checkout webhook and serves protected download", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "agyflow-flow-"));
  try {
    await writeFile(path.join(root, "client-onboarding-kit.zip"), "download-bytes");
    const connection = createCustomerFlowConnection();

    const webhookResult = await processLemonSqueezyPayload(connection, lemonSqueezyCheckoutPayload());
    assert.deepEqual(webhookResult, { orderId: 101, itemCount: 1 });
    assert.equal(connection.state.orders.length, 1);
    assert.equal(connection.state.orderItems.length, 1);
    assert.equal(connection.state.entitlements[0].status, "active");
    assert.equal(connection.state.downloadTokens.length, 1);

    const download = await resolveProtectedDownload({
      connection,
      token: "customer-facing-token",
      productFilesDir: root,
    });

    assert.equal(download.status, "ok");
    assert.equal(download.filename, "client-onboarding-kit.zip");
    assert.equal(download.mimeType, "application/zip");
    assert.equal(download.body.toString(), "download-bytes");
    assert.equal(connection.state.downloadCount, 1);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
