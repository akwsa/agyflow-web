import productsJson from "@/data/products.json";

export const dynamic = "force-dynamic";

function price(cents, currency = "USD") {
  const value = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function toPublicProduct(product) {
  const priceCents = Math.round(product.price * 100);
  const compareAtCents = product.compareAt == null
    ? null
    : Math.round(product.compareAt * 100);
  const commercialPriceCents = product.commercialPrice == null
    ? null
    : Math.round(product.commercialPrice * 100);

  return {
    slug: product.slug,
    name: product.name,
    shortName: product.shortName,
    tagline: product.tagline,
    category: product.category,
    status: product.status,
    featured: product.featured,
    price: { amount: product.price, cents: priceCents, currency: product.currency },
    compareAt: compareAtCents ? { cents: compareAtCents, currency: product.currency } : null,
    commercialPrice: commercialPriceCents
      ? { cents: commercialPriceCents, currency: product.currency }
      : null,
    priceLabel: price(priceCents, product.currency),
    compareAtLabel: compareAtCents ? price(compareAtCents, product.currency) : null,
    badge: product.badge,
    format: product.format,
    languages: product.languages,
    audience: product.audience,
    description: product.description,
    features: product.features,
    stats: product.stats,
    cover: product.cover,
    thumb: product.thumb,
    coverTheme: product.coverTheme,
    checkoutUrl: product.checkoutUrl,
    includesProducts: product.includesProducts,
  };
}

export async function GET() {
  const products = productsJson.filter((product) => product.status === "live");
  return Response.json(
    { status: "ok", count: products.length, products: products.map(toPublicProduct) },
    { headers: { "cache-control": "no-store" } },
  );
}
