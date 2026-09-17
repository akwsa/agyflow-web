import productsJson from "@/data/products.json";

export type ProductCategory =
  | "compliance"
  | "operations"
  | "ai-governance"
  | "education"
  | "bundle";

export type ProductStatus = "live" | "early-access";

export interface Product {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  category: ProductCategory;
  price: number;
  compareAt?: number;
  commercialPrice?: number;
  currency: string;
  badge?: string;
  featured?: boolean;
  status: ProductStatus;
  format: string[];
  languages: string[];
  audience: string;
  stats: { label: string; value: string }[];
  description: string[];
  features: string[];
  cover: string | null;
  thumb: string | null;
  coverTheme?: "earthy";
  checkoutUrl: string | null;
  includesProducts?: string[];
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  compliance: "Compliance",
  operations: "Client Operations",
  "ai-governance": "AI Governance",
  education: "Education",
  bundle: "Bundle",
};

const PRODUCTS = productsJson as Product[];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getLiveProducts(): Product[] {
  return PRODUCTS.filter((p) => p.status === "live");
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  const featured = PRODUCTS.filter((p) => p.featured);
  const rest = PRODUCTS.filter((p) => !p.featured && p.category !== "bundle");
  return [...featured, ...rest];
}

export function getIndividualProducts(): Product[] {
  return PRODUCTS.filter((p) => p.category !== "bundle");
}

export function getBundleProduct(): Product | undefined {
  return PRODUCTS.find((p) => p.category === "bundle");
}

export function getRelatedProducts(slug: string, limit = 3): Product[] {
  const current = getProductBySlug(slug);
  if (!current) return [];

  if (current.category === "bundle") {
    // For the bundle: promote the products it includes
    const included = (current.includesProducts ?? [])
      .map((s) => getProductBySlug(s))
      .filter((p): p is Product => Boolean(p));
    return included.slice(0, limit);
  }

  // For individuals: bundle first, then same-category, then the rest
  const bundle = getBundleProduct();
  const others = PRODUCTS.filter(
    (p) => p.slug !== slug && p.category !== "bundle"
  );
  const sameCategory = others.filter((p) => p.category === current.category);
  const differentCategory = others.filter((p) => p.category !== current.category);

  const ordered = [
    ...(bundle ? [bundle] : []),
    ...sameCategory,
    ...differentCategory,
  ];
  return ordered.slice(0, limit);
}

export function formatPrice(price: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}
