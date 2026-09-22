import { loadProducts, formatPrice } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await loadProducts();
  const live = products.filter((p) => p.status === "live");
  const bundle = products.find((p) => p.category === "bundle");
  const cheapest = live.length ? Math.min(...live.map((p) => p.price)) : 0;

  return (
    <main>
      <p className="eyebrow">AGYFLOW STAGING · TAHAP 2</p>
      <h1>Products rendered from MySQL with static fallback.</h1>
      <p>
        Source: <code>{process.env.DATABASE_URL ? "MySQL" : "static JSON"}</code>
        {" · "}live products: <code>{live.length}</code>
        {" · "}cheapest: <code>{formatPrice(cheapest)}</code>
        {bundle ? (
          <>
            {" · "}bundle: <code>{formatPrice(bundle.price)}</code> (was{" "}
            <code>{formatPrice(bundle.compareAt ?? 0)}</code>)
          </>
        ) : null}
      </p>

      <ul>
        {products.map((product) => (
          <li key={product.slug}>
            <a href={`/products/${product.slug}`}>{product.name}</a>
            <span className="meta">
              {" "}
              — {formatPrice(product.price, product.currency)} ·{" "}
              {product.format.join(" / ")} · {product.languages.join(" / ")}
              {product.status === "early-access" ? " · early-access" : ""}
            </span>
          </li>
        ))}
      </ul>

      <nav>
        <a href="/login">Sign in</a>
        <a href="/register">Create account</a>
        <a href="/account">Account</a>
        <a href="/products">Products page (server-rendered)</a>
        <a href="/api/products">API: list products</a>
        <a href="/api/health">API: health + MySQL</a>
      </nav>
    </main>
  );
}
