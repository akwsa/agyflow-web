import assert from "node:assert/strict";
import test from "node:test";

import {
  listAdminOrders,
  listAdminProducts,
  listAdminUsers,
  listCmsPages,
  normalizeCmsPageInput,
  normalizeProductInput,
} from "../lib/admin/data.js";

function fakeConnection({ executeRows = [], queryRows = [] } = {}) {
  const calls = [];
  return {
    calls,
    async execute(sql, params = []) {
      calls.push({ method: "execute", sql, params });
      const rows = executeRows.shift() ?? [];
      return [rows];
    },
    async query(sql, params = []) {
      calls.push({ method: "query", sql, params });
      const rows = queryRows.shift() ?? [];
      return [rows];
    },
  };
}

test("normalizeProductInput accepts product CMS fields and serializes JSON columns", () => {
  const product = normalizeProductInput({
    slug: "gdpr-checklist",
    name: "GDPR Checklist",
    shortName: "Checklist",
    category: "compliance",
    status: "live",
    priceCents: 1200,
    compareAtCents: 2400,
    commercialPriceCents: null,
    featured: true,
    sortOrder: 2,
    currency: "usd",
    badge: "Flagship",
    formats: ["Markdown"],
    languages: ["EN", "DE"],
    audience: "Agencies",
    description: ["One", "Two"],
    features: ["Feature"],
    stats: [{ label: "Items", value: "308" }],
    cover: "/products/gdpr.png",
    thumb: "/products/gdpr-thumb.png",
    checkoutUrl: "https://wkagungster.gumroad.com/l/gdpr-checklist",
    includesProducts: null,
    tagline: "Pre-launch privacy audit",
  });

  assert.equal(product.slug, "gdpr-checklist");
  assert.equal(product.status, "live");
  assert.equal(product.featured, 1);
  assert.equal(product.currency, "USD");
  assert.equal(product.price_cents, 1200);
  assert.equal(product.translation.locale, "en");
  assert.deepEqual(JSON.parse(product.formats), ["Markdown"]);
  assert.deepEqual(JSON.parse(product.translation.description), ["One", "Two"]);
});

test("normalizeProductInput rejects unsafe slugs and invalid status", () => {
  assert.throws(
    () => normalizeProductInput({ slug: "Bad Slug", name: "Bad", priceCents: 100, status: "live" }),
    /lowercase letters/,
  );
  assert.throws(
    () => normalizeProductInput({ slug: "bad", name: "Bad", priceCents: 100, status: "deleted" }),
    /status/,
  );
});

test("listAdminProducts maps rows and keeps filters parameterized", async () => {
  const connection = fakeConnection({
    executeRows: [[{
      id: 1,
      slug: "gdpr-checklist",
      name: "GDPR Checklist",
      short_name: "Checklist",
      category: "compliance",
      status: "live",
      featured: 1,
      sort_order: 3,
      price_cents: 1200,
      compare_at_cents: null,
      commercial_price_cents: null,
      currency: "USD",
      badge: null,
      formats: '["Markdown"]',
      languages: '["EN"]',
      audience: "Agencies",
      description: '["Body"]',
      features: '["Feature"]',
      stats: '[]',
      cover: null,
      thumb: null,
      cover_theme: null,
      checkout_url: null,
      includes_products: null,
      tagline: "Audit",
      created_at: "2026-01-01",
      updated_at: "2026-01-02",
    }]],
  });

  const products = await listAdminProducts(connection, { status: "live", q: "gdpr" });

  assert.equal(products.length, 1);
  assert.equal(products[0].slug, "gdpr-checklist");
  assert.deepEqual(products[0].formats, ["Markdown"]);
  assert.deepEqual(connection.calls[0].params, ["en", "live", "%gdpr%", "%gdpr%"]);
  assert.match(connection.calls[0].sql, /WHERE p\.status = \?/);
});

test("listAdminOrders returns real order totals with item and token counts", async () => {
  const connection = fakeConnection({
    executeRows: [[{
      id: 5,
      order_number: "AGY-2026-000001",
      email: "buyer@example.test",
      provider: "gumroad",
      provider_order_id: "sale-1",
      status: "paid",
      total_cents: 1200,
      currency: "USD",
      created_at: "2026-01-01",
      item_count: 2,
      token_count: 2,
      user_email: "buyer@example.test",
      user_name: "Buyer",
    }]],
  });

  const orders = await listAdminOrders(connection, { provider: "gumroad", status: "paid" });

  assert.equal(orders[0].orderNumber, "AGY-2026-000001");
  assert.equal(orders[0].itemCount, 2);
  assert.equal(orders[0].tokenCount, 2);
  assert.deepEqual(connection.calls[0].params, ["paid", "gumroad"]);
});

test("listAdminUsers returns role and order summary without password hashes", async () => {
  const connection = fakeConnection({
    executeRows: [[{
      id: 9,
      email: "admin@example.test",
      name: "Admin",
      role: "admin",
      email_verified_at: "2026-01-01",
      created_at: "2026-01-01",
      order_count: 4,
      total_spend_cents: 5800,
    }]],
  });

  const users = await listAdminUsers(connection, { role: "admin" });

  assert.equal(users[0].emailVerified, true);
  assert.equal(users[0].totalSpendCents, 5800);
  assert.equal("passwordHash" in users[0], false);
});

test("CMS page input is constrained to known legal pages and locales", () => {
  const page = normalizeCmsPageInput({
    slug: "privacy",
    locale: "de",
    title: "Privacy",
    bodyMarkdown: "Body",
    status: "draft",
  });

  assert.equal(page.slug, "privacy");
  assert.equal(page.locale, "de");
  assert.equal(page.status, "draft");
  assert.throws(
    () => normalizeCmsPageInput({ slug: "about", locale: "en", title: "About", bodyMarkdown: "Body" }),
    /CMS slug/,
  );
});

test("listCmsPages maps publish state and locale fields", async () => {
  const connection = fakeConnection({
    executeRows: [[{
      id: 3,
      slug: "terms",
      locale: "fr",
      title: "Terms",
      status: "published",
      updated_at: "2026-01-02",
      published_at: "2026-01-03",
    }]],
  });

  const pages = await listCmsPages(connection, { locale: "fr" });

  assert.equal(pages[0].slug, "terms");
  assert.equal(pages[0].locale, "fr");
  assert.equal(pages[0].status, "published");
  assert.deepEqual(connection.calls[0].params, ["fr"]);
});
