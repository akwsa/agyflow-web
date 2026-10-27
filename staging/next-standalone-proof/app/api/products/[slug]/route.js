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

export async function GET(_request, { params }) {
  const slug = params.slug;
  const product = productsJson.find((item) => item.slug === slug);
  if (!product) {
    return Response.json({ status: "not_found", slug }, { status: 404 });
  }

  const priceCents = Math.round(product.price * 100);
  const compareAtCents = product.compareAt == null
    ? null
    : Math.round(product.compareAt * 100);
  return Response.json(
    {
      status: "ok",
      product: {
        ...product,
        priceCents,
        compareAtCents,
        commercialPriceCents: product.commercialPrice == null
          ? null
          : Math.round(product.commercialPrice * 100),
        priceLabel: price(priceCents, product.currency),
        compareAtLabel: compareAtCents ? price(compareAtCents, product.currency) : null,
      },
    },
    { headers: { "cache-control": "no-store" } },
  );
}
