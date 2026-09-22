import { getProductBySlug } from "@/db/products.mjs";
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

export async function GET(_request, { params }) {
  if (!pool) {
    return Response.json(
      { status: "error", error: "DATABASE_URL is not configured" },
      { status: 503 },
    );
  }

  const slug = params.slug;

  try {
    const product = await getProductBySlug(pool, slug, { locale: "en" });

    if (!product) {
      return Response.json({ status: "not_found", slug }, { status: 404 });
    }

    return Response.json(
      {
        status: "ok",
        product: {
          ...product,
          priceLabel: price(product.priceCents, product.currency),
          compareAtLabel: product.compareAtCents
            ? price(product.compareAtCents, product.currency)
            : null,
        },
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    return Response.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "database query failed",
      },
      { status: 503 },
    );
  }
}
