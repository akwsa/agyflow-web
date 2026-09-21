import "server-only";

import productsJson from "@/data/products.json";
import mysql from "mysql2/promise";

import type {
  Product,
  ProductCategory,
  ProductStatus,
} from "@/lib/products-types";

export type { Product, ProductCategory, ProductStatus } from "@/lib/products-types";
export { CATEGORY_LABELS, formatPrice, getRelatedProducts } from "@/lib/products-types";

const STATIC_PRODUCTS: Product[] = productsJson as Product[];

let cachedProducts: Product[] | null = null;

/**
 * Products read from MySQL on demand.
 *
 * Returns the static JSON fallback when the database is not configured or the
 * query fails, so the public site always renders even without a DB.
 */
export async function loadProducts(): Promise<Product[]> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return STATIC_PRODUCTS;
  }

  if (cachedProducts) {
    return cachedProducts;
  }

  try {
    const connection = await mysql.createConnection({
      uri: databaseUrl,
      connectionLimit: 3,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });

    try {
      const [rows] = await connection.execute(
        `SELECT
           p.slug,
           p.name,
           p.short_name AS shortName,
           p.category,
           p.status,
           p.featured,
           p.sort_order AS sortOrder,
           p.price_cents / 100 AS price,
           p.compare_at_cents / 100 AS compareAt,
           p.commercial_price_cents / 100 AS commercialPrice,
           p.currency,
           p.badge,
           p.formats,
           p.languages,
           p.audience,
           p.description,
           p.features,
           p.stats,
           p.cover,
           p.thumb,
           p.cover_theme AS coverTheme,
           p.checkout_url AS checkoutUrl,
           p.includes_products AS includesProducts,
           t.tagline
         FROM products p
         LEFT JOIN product_translations t
           ON t.product_id = p.id AND t.locale = 'en'
         ORDER BY p.sort_order ASC, p.id ASC`,
      );

      cachedProducts = rowsToProducts(rows as ProductRow[]);
      return cachedProducts;
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.warn(
      "Product database query failed, falling back to static products:",
      error instanceof Error ? error.message : error,
    );
    return STATIC_PRODUCTS;
  }
}

interface ProductRow {
  slug: string;
  name: string;
  shortName: string;
  category: ProductCategory;
  status: ProductStatus;
  featured: number;
  sortOrder: number;
  price: number;
  compareAt: number | null;
  commercialPrice: number | null;
  currency: string;
  badge: string | null;
  formats: string;
  languages: string;
  audience: string;
  description: string;
  features: string;
  stats: string;
  cover: string | null;
  thumb: string | null;
  coverTheme: string | null;
  checkoutUrl: string | null;
  includesProducts: string | null;
  tagline: string | null;
}

function jsonArray(value: string | string[] | null): string[] {
  if (!value) return [];
  const parsed = Array.isArray(value) ? value : JSON.parse(value);
  return Array.isArray(parsed) ? parsed : [];
}

function rowsToProducts(rows: ProductRow[]): Product[] {
  return rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    shortName: row.shortName,
    tagline: row.tagline ?? "",
    category: row.category,
    price: Number(row.price),
    compareAt: row.compareAt == null ? undefined : Number(row.compareAt),
    commercialPrice: row.commercialPrice == null ? undefined : Number(row.commercialPrice),
    currency: row.currency,
    badge: row.badge ?? undefined,
    featured: Number(row.featured) === 1,
    status: row.status,
    format: jsonArray(row.formats),
    languages: jsonArray(row.languages),
    audience: row.audience,
    stats: jsonArray(row.stats) as unknown as { label: string; value: string }[],
    description: jsonArray(row.description),
    features: jsonArray(row.features),
    cover: row.cover,
    thumb: row.thumb,
    coverTheme: row.coverTheme === "earthy" ? "earthy" : undefined,
    checkoutUrl: row.checkoutUrl,
    includesProducts: row.includesProducts
      ? (JSON.parse(row.includesProducts) as string[])
      : undefined,
  }));
}

export function getAllProducts(): Product[] {
  return cachedProducts ?? STATIC_PRODUCTS;
}

export function getLiveProducts(): Product[] {
  return getAllProducts().filter((p) => p.status === "live");
}

export function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  const all = getAllProducts();
  const featured = all.filter((p) => p.featured);
  const rest = all.filter((p) => !p.featured && p.category !== "bundle");
  return [...featured, ...rest];
}

export function getIndividualProducts(): Product[] {
  return getAllProducts().filter((p) => p.category !== "bundle");
}

export function getBundleProduct(): Product | undefined {
  return getAllProducts().find((p) => p.category === "bundle");
}
