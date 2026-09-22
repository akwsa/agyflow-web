import { listProducts } from "@/db/products.mjs";
import mysql from "mysql2/promise";

export const dynamic = "force-dynamic";

const pool = !process.env.DATABASE_URL
  ? null
  : mysql.createPool({
      uri: process.env.DATABASE_URL,
      connectionLimit: 5,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });

function price(cents, currency = "USD") {
  const value = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function toPublicProduct(row) {
  return {
    slug: row.slug,
    name: row.name,
    shortName: row.shortName,
    tagline: row.tagline,
    category: row.category,
    status: row.status,
    featured: row.featured,
    price: { amount: row.priceCents / 100, cents: row.priceCents, currency: row.currency },
    compareAt: row.compareAtCents ? { cents: row.compareAtCents, currency: row.currency } : null,
    commercialPrice: row.commercialPriceCents
      ? { cents: row.commercialPriceCents, currency: row.currency }
      : null,
    priceLabel: price(row.priceCents, row.currency),
    compareAtLabel: row.compareAtCents ? price(row.compareAtCents, row.currency) : null,
    badge: row.badge,
    format: row.format,
    languages: row.languages,
    audience: row.audience,
    description: row.description,
    features: row.features,
    stats: row.stats,
    cover: row.cover,
    thumb: row.thumb,
    coverTheme: row.coverTheme,
    checkoutUrl: row.checkoutUrl,
    includesProducts: row.includesProducts,
  };
}

export async function GET() {
  if (!pool) {
    return Response.json(
      { status: "error", error: "DATABASE_URL is not configured", products: [] },
      { status: 503 },
    );
  }

  try {
    const rows = await listProducts(pool, { locale: "en", status: "live" });
    return Response.json(
      {
        status: "ok",
        count: rows.length,
        products: rows.map(toPublicProduct),
      },
      {
        headers: { "cache-control": "no-store" },
      },
    );
  } catch (error) {
    return Response.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "database query failed",
        products: [],
      },
      { status: 503 },
    );
  }
}
