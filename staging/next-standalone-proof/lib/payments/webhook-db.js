import { withConnection } from "../auth/db.js";
import {
  generateDownloadToken,
  generateOrderNumber,
  hashDownloadToken,
  normalizeMoneyToCents,
  toSlug,
} from "./webhook-utils.js";

const DOWNLOAD_TOKEN_DAYS = 365;

function jsonParam(value) {
  return JSON.stringify(value ?? {});
}

function boolParam(value) {
  return value ? 1 : 0;
}

function truthy(value) {
  if (typeof value === "boolean") return value;
  return ["1", "true", "yes"].includes(String(value ?? "").toLowerCase());
}

function emailFrom(value) {
  return String(value ?? "").trim().toLowerCase();
}

function dateAfterDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function recordWebhookEvent(connection, event) {
  await connection.execute(
    `INSERT INTO webhook_events
       (provider, event_id, event_type, payload_json, signature_valid, process_status, error_message)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       id = LAST_INSERT_ID(id),
       payload_json = VALUES(payload_json),
       signature_valid = VALUES(signature_valid),
       duplicate_count = duplicate_count + 1,
       last_seen_at = CURRENT_TIMESTAMP,
       error_message = CASE
         WHEN VALUES(signature_valid) = 0 THEN VALUES(error_message)
         ELSE error_message
       END`,
    [
      event.provider,
      event.eventId,
      event.eventType,
      jsonParam(event.payload),
      boolParam(event.signatureValid),
      event.signatureValid ? "received" : "failed",
      event.signatureValid ? null : event.invalidReason,
    ],
  );

  const [[row]] = await connection.execute(
    `SELECT id, process_status, duplicate_count
       FROM webhook_events
      WHERE provider = ? AND event_id = ?
      LIMIT 1`,
    [event.provider, event.eventId],
  );
  return row;
}

async function markWebhookFailed(provider, eventId, error) {
  await withConnection(async (connection) => {
    await connection.execute(
      `UPDATE webhook_events
          SET process_status = 'failed', error_message = ?
        WHERE provider = ? AND event_id = ?`,
      [error instanceof Error ? error.message : String(error), provider, eventId],
    );
  });
}

export async function processWebhookDelivery(event, processEvent) {
  try {
    return await withConnection(async (connection) => {
      await recordWebhookEvent(connection, event);
      await connection.beginTransaction();

      try {
        const [[locked]] = await connection.execute(
          `SELECT id, process_status, duplicate_count
             FROM webhook_events
            WHERE provider = ? AND event_id = ?
            LIMIT 1
            FOR UPDATE`,
          [event.provider, event.eventId],
        );

        if (!locked) {
          throw new Error("Webhook event was not recorded");
        }

        if (!event.signatureValid) {
          await connection.execute(
            `UPDATE webhook_events
                SET process_status = 'failed', error_message = ?
              WHERE id = ?`,
            [event.invalidReason ?? "Invalid signature", locked.id],
          );
          await connection.commit();
          return {
            status: "invalid",
            duplicate: Number(locked.duplicate_count) > 0,
            eventDatabaseId: Number(locked.id),
          };
        }

        if (locked.process_status === "processed") {
          await connection.commit();
          return {
            status: "duplicate",
            duplicate: true,
            eventDatabaseId: Number(locked.id),
          };
        }

        await connection.execute(
          `UPDATE webhook_events
              SET process_status = 'processing', error_message = NULL
            WHERE id = ?`,
          [locked.id],
        );

        const result = await processEvent(connection, Number(locked.id));

        await connection.execute(
          `UPDATE webhook_events
              SET process_status = 'processed', processed_at = CURRENT_TIMESTAMP, error_message = NULL
            WHERE id = ?`,
          [locked.id],
        );
        await connection.commit();

        return {
          status: "processed",
          duplicate: Number(locked.duplicate_count) > 0,
          eventDatabaseId: Number(locked.id),
          result,
        };
      } catch (error) {
        await connection.rollback();
        throw error;
      }
    });
  } catch (error) {
    await markWebhookFailed(event.provider, event.eventId, error);
    throw error;
  }
}

async function findUserIdByEmail(connection, email) {
  if (!email) return null;
  const [rows] = await connection.execute(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [email],
  );
  return rows[0] ? Number(rows[0].id) : null;
}

async function findProductIdBySlug(connection, slug) {
  if (!slug) return null;
  const [rows] = await connection.execute(
    "SELECT id FROM products WHERE slug = ? LIMIT 1",
    [slug],
  );
  return rows[0] ? Number(rows[0].id) : null;
}

function statusFromLemonSqueezy(attributes) {
  const status = String(attributes?.status ?? "").toLowerCase();
  if (["paid", "fulfilled", "active"].includes(status)) return "paid";
  if (["refunded", "partially_refunded"].includes(status)) return "refunded";
  if (!status) return "paid";
  return status;
}

function lemonSqueezyItems(payload) {
  const attributes = payload?.data?.attributes ?? {};
  const source = Array.isArray(attributes.order_items)
    ? attributes.order_items
    : attributes.first_order_item
      ? [attributes.first_order_item]
      : [];

  if (source.length === 0) {
    const name = attributes.product_name ?? attributes.variant_name ?? `lemonsqueezy-${payload?.data?.id}`;
    return [{
      productSlug: toSlug(name),
      providerProductId: attributes.product_id ?? null,
      providerVariantId: attributes.variant_id ?? null,
      variant: attributes.variant_name ?? null,
      quantity: 1,
      unitPriceCents: normalizeMoneyToCents(attributes.subtotal ?? attributes.total, "lemonsqueezy"),
      licenseKey: null,
    }];
  }

  return source.map((item) => {
    const name = item.product_name ?? attributes.product_name ?? attributes.variant_name ?? `lemonsqueezy-${payload?.data?.id}`;
    return {
      productSlug: toSlug(item.product_slug ?? item.slug ?? name),
      providerProductId: item.product_id ?? attributes.product_id ?? null,
      providerVariantId: item.variant_id ?? attributes.variant_id ?? null,
      variant: item.variant_name ?? attributes.variant_name ?? null,
      quantity: Number(item.quantity ?? 1) || 1,
      unitPriceCents: normalizeMoneyToCents(item.price ?? item.unit_price ?? attributes.subtotal ?? attributes.total, "lemonsqueezy"),
      licenseKey: null,
    };
  });
}

function gumroadProductSlug(payload) {
  const permalink = payload.product_permalink ?? payload.permalink ?? payload.product_id ?? payload.product_name;
  if (typeof permalink === "string" && permalink.includes("/")) {
    const path = new URL(permalink, "https://gumroad.com").pathname;
    return toSlug(path.split("/").filter(Boolean).at(-1));
  }
  return toSlug(permalink);
}

function gumroadEventType(payload) {
  if (truthy(payload.refunded) || String(payload.resource_name ?? "").toLowerCase() === "refund") {
    return "refund";
  }
  return "sale";
}

async function insertOrder(connection, order) {
  const userId = await findUserIdByEmail(connection, order.email);

  await connection.execute(
    `INSERT INTO orders
       (order_number, user_id, email, provider, provider_order_id, status,
        subtotal_cents, tax_cents, total_cents, currency, country, raw_payload_json, refunded_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       id = LAST_INSERT_ID(id),
       user_id = VALUES(user_id),
       email = VALUES(email),
       status = VALUES(status),
       subtotal_cents = VALUES(subtotal_cents),
       tax_cents = VALUES(tax_cents),
       total_cents = VALUES(total_cents),
       currency = VALUES(currency),
       country = VALUES(country),
       raw_payload_json = VALUES(raw_payload_json),
       refunded_at = VALUES(refunded_at)`,
    [
      generateOrderNumber(),
      userId,
      order.email,
      order.provider,
      order.providerOrderId,
      order.status,
      order.subtotalCents,
      order.taxCents,
      order.totalCents,
      order.currency,
      order.country,
      jsonParam(order.payload),
      order.refundedAt ?? null,
    ],
  );

  const [[row]] = await connection.execute(
    `SELECT id, user_id
       FROM orders
      WHERE provider = ? AND provider_order_id = ?
      LIMIT 1`,
    [order.provider, order.providerOrderId],
  );
  return { id: Number(row.id), userId: row.user_id == null ? null : Number(row.user_id) };
}

async function orderAlreadyHasItems(connection, orderId) {
  const [[row]] = await connection.execute(
    "SELECT COUNT(*) AS count FROM order_items WHERE order_id = ?",
    [orderId],
  );
  return Number(row.count) > 0;
}

async function createItemAccess(connection, { orderId, userId, email, provider, item }) {
  const productId = await findProductIdBySlug(connection, item.productSlug);
  const [result] = await connection.execute(
    `INSERT INTO order_items
       (order_id, product_id, product_slug, provider_product_id, provider_variant_id,
        variant, quantity, unit_price_cents, license_key)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      orderId,
      productId,
      item.productSlug,
      item.providerProductId,
      item.providerVariantId,
      item.variant,
      item.quantity,
      item.unitPriceCents,
      item.licenseKey,
    ],
  );

  const orderItemId = Number(result.insertId);
  const token = generateDownloadToken();
  await connection.execute(
    `INSERT INTO download_tokens
       (token_hash, token_preview, order_item_id, user_id, email, expires_at, max_downloads)
     VALUES (?, ?, ?, ?, ?, ?, 10)`,
    [hashDownloadToken(token), token.slice(0, 12), orderItemId, userId, email, dateAfterDays(DOWNLOAD_TOKEN_DAYS)],
  );

  await connection.execute(
    `INSERT INTO entitlements
       (user_id, email, source, source_id, product_id, product_slug, provider, status, expires_at)
     VALUES (?, ?, 'order', ?, ?, ?, ?, 'active', NULL)
     ON DUPLICATE KEY UPDATE
       user_id = VALUES(user_id),
       email = VALUES(email),
       product_id = VALUES(product_id),
       product_slug = VALUES(product_slug),
       provider = VALUES(provider),
       status = 'active',
       expires_at = NULL`,
    [userId, email, orderItemId, productId, item.productSlug, provider],
  );
}

async function revokeOrderAccess(connection, provider, providerOrderId) {
  const [orders] = await connection.execute(
    `SELECT id
       FROM orders
      WHERE provider = ? AND provider_order_id = ?
      LIMIT 1`,
    [provider, providerOrderId],
  );

  if (!orders[0]) return { orderFound: false };
  const orderId = Number(orders[0].id);

  await connection.execute(
    `UPDATE orders
        SET status = 'refunded', refunded_at = COALESCE(refunded_at, CURRENT_TIMESTAMP)
      WHERE id = ?`,
    [orderId],
  );
  await connection.execute(
    `UPDATE entitlements e
       JOIN order_items oi ON oi.id = e.source_id AND e.source = 'order'
        SET e.status = 'revoked'
      WHERE oi.order_id = ?`,
    [orderId],
  );
  await connection.execute(
    `UPDATE download_tokens dt
       JOIN order_items oi ON oi.id = dt.order_item_id
        SET dt.revoked_at = COALESCE(dt.revoked_at, CURRENT_TIMESTAMP)
      WHERE oi.order_id = ?`,
    [orderId],
  );

  return { orderFound: true, orderId };
}

export async function processLemonSqueezyPayload(connection, payload) {
  const eventName = payload?.meta?.event_name ?? "unknown";
  const data = payload?.data ?? {};
  const attributes = data.attributes ?? {};

  if (eventName === "order_refunded") {
    return revokeOrderAccess(connection, "lemonsqueezy", String(data.id ?? attributes.order_id ?? ""));
  }

  if (eventName !== "order_created") {
    return { ignored: true, eventName };
  }

  const email = emailFrom(attributes.user_email ?? attributes.customer_email ?? attributes.email);
  if (!email) throw new Error("Lemon Squeezy order is missing customer email");

  const items = lemonSqueezyItems(payload);
  const totalFromItems = items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
  const subtotalCents = normalizeMoneyToCents(attributes.subtotal, "lemonsqueezy") || totalFromItems;
  const taxCents = normalizeMoneyToCents(attributes.tax, "lemonsqueezy");
  const totalCents = normalizeMoneyToCents(attributes.total, "lemonsqueezy") || subtotalCents + taxCents;
  const order = await insertOrder(connection, {
    provider: "lemonsqueezy",
    providerOrderId: String(data.id),
    email,
    status: statusFromLemonSqueezy(attributes),
    subtotalCents,
    taxCents,
    totalCents,
    currency: String(attributes.currency ?? "USD").toUpperCase().slice(0, 3),
    country: attributes.country_code ?? attributes.country ?? null,
    payload,
  });

  if (!(await orderAlreadyHasItems(connection, order.id))) {
    for (const item of items) {
      await createItemAccess(connection, {
        orderId: order.id,
        userId: order.userId,
        email,
        provider: "lemonsqueezy",
        item,
      });
    }
  }

  return { orderId: order.id, itemCount: items.length };
}

export async function processGumroadPayload(connection, payload) {
  const eventType = gumroadEventType(payload);
  const saleId = String(payload.sale_id ?? payload.id ?? "");
  if (!saleId) throw new Error("Gumroad webhook is missing sale_id");

  if (eventType === "refund") {
    return revokeOrderAccess(connection, "gumroad", saleId);
  }

  const email = emailFrom(payload.email);
  if (!email) throw new Error("Gumroad sale is missing customer email");

  const productSlug = gumroadProductSlug(payload);
  const priceCents = normalizeMoneyToCents(payload.price ?? payload.displayed_price_cents, "gumroad");
  const order = await insertOrder(connection, {
    provider: "gumroad",
    providerOrderId: saleId,
    email,
    status: "paid",
    subtotalCents: priceCents,
    taxCents: normalizeMoneyToCents(payload.tax, "gumroad"),
    totalCents: priceCents,
    currency: String(payload.currency ?? "USD").toUpperCase().slice(0, 3),
    country: payload.country_iso2 ?? payload.country ?? null,
    payload,
  });

  if (!(await orderAlreadyHasItems(connection, order.id))) {
    await createItemAccess(connection, {
      orderId: order.id,
      userId: order.userId,
      email,
      provider: "gumroad",
      item: {
        productSlug,
        providerProductId: payload.product_id ?? null,
        providerVariantId: payload.variant_id ?? null,
        variant: payload.variant ?? payload.variants ?? (payload.license_key ? "commercial" : "individual"),
        quantity: 1,
        unitPriceCents: priceCents,
        licenseKey: payload.license_key ?? null,
      },
    });
  }

  return { orderId: order.id, itemCount: 1 };
}

export { gumroadEventType };
