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

export function formatPrice(price: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}

export function getRelatedProducts(
  slug: string,
  limit = 3,
  all?: Product[],
): Product[] {
  const products = all ?? [];
  const current = products.find((p) => p.slug === slug);
  if (!current) return [];

  if (current.category === "bundle") {
    // For the bundle: promote the products it includes
    const included = (current.includesProducts ?? [])
      .map((s) => products.find((p) => p.slug === s))
      .filter((p): p is Product => Boolean(p));
    return included.slice(0, limit);
  }

  // For individuals: bundle first, then same-category, then the rest
  const bundle = products.find((p) => p.category === "bundle");
  const others = products.filter((p) => p.slug !== slug && p.category !== "bundle");
  const sameCategory = others.filter((p) => p.category === current.category);
  const differentCategory = others.filter((p) => p.category !== current.category);

  const ordered = [
    ...(bundle ? [bundle] : []),
    ...sameCategory,
    ...differentCategory,
  ];
  return ordered.slice(0, limit);
}
