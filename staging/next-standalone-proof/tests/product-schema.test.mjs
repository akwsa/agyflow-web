import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import mysql from "mysql2/promise";

import { normalizeProduct } from "../db/product-seed.mjs";
import { listProducts, getProductBySlug } from "../db/products.mjs";
import { applyMigrations } from "../db/migrate.mjs";
import { seedProducts } from "../db/product-seed.mjs";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for the database integration test");
}

const SOURCE = JSON.parse(await readFile(new URL("../data/products.json", import.meta.url), "utf8"));
const PRODUCTS = SOURCE.products ?? SOURCE;
const LIVE = PRODUCTS.filter((p) => p.status === "live");

test("normalizeProduct maps the source product shape onto the schema", () => {
  const { product, translation } = normalizeProduct(PRODUCTS[0], 0);

  assert.equal(product.slug, "agency-compliance-toolkit");
  assert.equal(product.name, "Agency Compliance Toolkit");
  assert.equal(product.short_name, "Complete Bundle");
  assert.equal(product.category, "bundle");
  assert.equal(product.price_cents, 2900);
  assert.equal(product.compare_at_cents, 6300);
  assert.equal(product.commercial_price_cents, 5900);
  assert.equal(product.featured, true);
  assert.equal(product.sort_order, 0);
  assert.equal(product.currency, "USD");
  assert.deepEqual(JSON.parse(product.formats), ["Markdown", "Excel", "ZIP"]);
  assert.deepEqual(JSON.parse(product.languages), ["EN", "DE", "FR"]);
  assert.deepEqual(JSON.parse(product.includes_products), [
    "gdpr-checklist",
    "cookie-audit",
    "invoice-reminders",
    "client-onboarding",
    "ai-policy-pack",
  ]);
  assert.equal(product.checkout_url, "https://wkagungster.gumroad.com/l/agency-compliance-toolkit");

  assert.equal(translation.locale, "en");
  assert.equal(translation.name, "Agency Compliance Toolkit");
  assert.ok(translation.tagline.includes("complete compliance"));
  assert.equal(JSON.parse(translation.features).length, PRODUCTS[0].features.length);
  assert.equal(JSON.parse(translation.description).length, PRODUCTS[0].description.length);
});

test("migrations and product seed are idempotent on staging MySQL", async () => {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    const baseline = await applyMigrations(connection);
    await seedProducts(connection, PRODUCTS);

    const secondRun = await applyMigrations(connection);
    assert.deepEqual(secondRun.applied, []);
    for (const migration of [...baseline.applied, ...baseline.skipped]) {
      assert.ok(
        secondRun.skipped.includes(migration),
        `expected second migration run to skip ${migration}`,
      );
    }
    await seedProducts(connection, PRODUCTS);

    const [[{ productCount }]] = await connection.execute(
      "SELECT COUNT(*) AS productCount FROM products",
    );
    const [[{ translationCount }]] = await connection.execute(
      "SELECT COUNT(*) AS translationCount FROM product_translations",
    );

    assert.equal(productCount, PRODUCTS.length);
    assert.equal(translationCount, PRODUCTS.length);
  } finally {
    await connection.end();
  }
});

test("listProducts returns live products in source order with full fields", async () => {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    const products = await listProducts(connection, { locale: "en" });

    assert.equal(products.length, LIVE.length);
    assert.equal(products[0].slug, LIVE[0].slug);
    assert.equal(products[0].priceCents, 2900);
    assert.equal(products[0].compareAtCents, 6300);
    assert.equal(products[0].commercialPriceCents, 5900);
    assert.deepEqual(products[0].format, ["Markdown", "Excel", "ZIP"]);
    assert.deepEqual(products[0].languages, ["EN", "DE", "FR"]);
    assert.deepEqual(products[0].includesProducts, [
      "gdpr-checklist",
      "cookie-audit",
      "invoice-reminders",
      "client-onboarding",
      "ai-policy-pack",
    ]);
    assert.equal(products[0].checkoutUrl, "https://wkagungster.gumroad.com/l/agency-compliance-toolkit");
    assert.equal(products.at(-1).slug, LIVE.at(-1).slug);
  } finally {
    await connection.end();
  }
});

test("getProductBySlug returns a product or null", async () => {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    const found = await getProductBySlug(connection, "gdpr-checklist");
    assert.equal(found.slug, "gdpr-checklist");
    assert.equal(found.category, "compliance");
    assert.equal(found.priceCents, 1200);

    const missing = await getProductBySlug(connection, "does-not-exist");
    assert.equal(missing, null);
  } finally {
    await connection.end();
  }
});
