import "server-only";

import productsJson from "@/data/products.json";

import type {
  Product,
  ProductCategory,
  ProductStatus,
} from "@/lib/products-types";

export type { Product, ProductCategory, ProductStatus } from "@/lib/products-types";
export { CATEGORY_LABELS, formatPrice, getRelatedProducts } from "@/lib/products-types";

const STATIC_PRODUCTS: Product[] = productsJson as Product[];

/**
 * Public catalog source for the launch-readiness website.
 *
 * Admin and order routes remain database-backed. The public offer stays tied
 * to the reviewed catalog shipped with this deployment until the CMS rows are
 * intentionally updated.
 */
export async function loadProducts(): Promise<Product[]> {
  return STATIC_PRODUCTS;
}

export function getAllProducts(): Product[] {
  return STATIC_PRODUCTS;
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
