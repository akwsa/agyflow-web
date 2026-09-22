import { loadProducts, formatPrice, getRelatedProducts } from "@/lib/products";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }) {
  return { title: `Staging · ${params.slug} — Agyflow` };
}

export default async function ProductDetailPage({ params }) {
  const products = await loadProducts();
  const product = products.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const related = getRelatedProducts(product.slug, 3, products);

  return (
    <main>
      <p className="eyebrow">AGYFLOW STAGING · TAHAP 2</p>
      <h1>{product.name}</h1>
      <p className="tagline">{product.tagline}</p>
      <p className="price">
        {formatPrice(product.price, product.currency)}
        {product.compareAt ? (
          <s> {formatPrice(product.compareAt, product.currency)}</s>
        ) : null}
      </p>

      <div className="specs">
        <p>
          <strong>Format</strong>: {product.format.join(" / ")}
        </p>
        <p>
          <strong>Languages</strong>: {product.languages.join(" / ")}
        </p>
        <p>
          <strong>Audience</strong>: {product.audience}
        </p>
        {product.checkoutUrl ? (
          <p>
            <strong>Checkout</strong>:{" "}
            <a href={product.checkoutUrl}>{product.checkoutUrl}</a>
          </p>
        ) : null}
      </div>

      <h2>Description</h2>
      {product.description.map((para, index) => (
        <p key={index}>{para}</p>
      ))}

      {product.features.length > 0 ? (
        <>
          <h2>Features</h2>
          <ul>
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </>
      ) : null}

      {product.includesProducts?.length ? (
        <>
          <h2>Included products</h2>
          <ul>
            {product.includesProducts.map((slug) => {
              const included = products.find((p) => p.slug === slug);
              return included ? (
                <li key={slug}>
                  <a href={`/products/${slug}`}>{included.name}</a> —{" "}
                  {formatPrice(included.price, included.currency)}
                </li>
              ) : null;
            })}
          </ul>
        </>
      ) : null}

      {related.length > 0 ? (
        <>
          <h2>Related</h2>
          <ul>
            {related.map((rel) => (
              <li key={rel.slug}>
                <a href={`/products/${rel.slug}`}>{rel.shortName}</a> —{" "}
                {formatPrice(rel.price, rel.currency)}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <nav>
        <a href="/products">All products</a>
        <a href="/">Staging home</a>
      </nav>
    </main>
  );
}
