import { loadProducts, formatPrice, CATEGORY_LABELS } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Staging Products — Agyflow",
  description: "Server-rendered product catalog reading MySQL with static fallback",
};

export default async function ProductsPage() {
  const products = await loadProducts();
  const live = products.filter((p) => p.status === "live");

  return (
    <main>
      <p className="eyebrow">AGYFLOW STAGING · TAHAP 2</p>
      <h1>Product catalog (server-rendered)</h1>
      <p>
        <code>{live.length}</code> live products of <code>{products.length}</code> total,
        read from <code>{process.env.DATABASE_URL ? "MySQL" : "static JSON"}</code>.
      </p>

      <div className="catalog">
        {live.map((product) => (
          <a
            key={product.slug}
            className="card"
            href={`/products/${product.slug}`}
          >
            <h2>{product.name}</h2>
            <p className="tagline">{product.tagline}</p>
            <p className="meta">
              {CATEGORY_LABELS[product.category]} · {product.format.join(" / ")} ·{" "}
              {product.languages.join(" / ")}
            </p>
            <p className="price">
              {formatPrice(product.price, product.currency)}
              {product.compareAt ? (
                <s> {formatPrice(product.compareAt, product.currency)}</s>
              ) : null}
            </p>
          </a>
        ))}
      </div>

      <nav>
        <a href="/">Back to staging home</a>
        <a href="/api/products">API: list products</a>
      </nav>
    </main>
  );
}
