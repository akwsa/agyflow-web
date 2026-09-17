import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  Download,
  FileText,
  Languages,
  ShieldCheck,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCover from "@/components/ProductCover";
import {
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
  formatPrice,
  CATEGORY_LABELS,
} from "@/lib/products";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return {};

  const title = `${product.name} — ${formatPrice(product.price)} | Agyflow`;
  const description = product.tagline;

  return {
    title,
    description,
    keywords: [
      ...product.name.toLowerCase().split(/\s+/),
      ...product.format.map((f) => f.toLowerCase()),
      "digital download",
      "Agyflow",
    ],
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title,
      description,
      url: `https://agyflow.com/products/${product.slug}`,
      siteName: "Agyflow",
      images: [
        product.cover
          ? { url: product.cover, width: 1280, height: 720, alt: product.name }
          : "/agyflow-brand.svg",
      ],
      locale: "en_US",
      type: "website",
    },
  };
}

function ProductJsonLd({ slug }: { slug: string }) {
  const product = getProductBySlug(slug);
  if (!product) return null;

  const json = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline,
    image: product.cover
      ? `https://agyflow.com${product.cover}`
      : "https://agyflow.com/agyflow-brand.svg",
    brand: { "@type": "Brand", name: "Agyflow" },
    category: CATEGORY_LABELS[product.category],
    offers: {
      "@type": "Offer",
      url: `https://agyflow.com/products/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      availability:
        product.status === "live"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      seller: { "@type": "Organization", name: "Agyflow" },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = getRelatedProducts(product.slug, 3);
  const isBundle = product.category === "bundle";

  return (
    <main className="min-h-[100dvh] bg-neutral-void text-slate-100 flex flex-col">
      <Navbar lang="en" />
      <ProductJsonLd slug={product.slug} />

      {/* Breadcrumb */}
      <div className="border-b border-neutral-graphite/60 bg-neutral-void">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-neutral-ash"
          >
            <Link
              href="/"
              className="transition-colors hover:text-neutral-paper"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href="/products"
              className="transition-colors hover:text-neutral-paper"
            >
              Products
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-neutral-mist">{product.shortName}</span>
          </nav>
        </div>
      </div>

      {/* Product hero */}
      <section className="relative overflow-hidden border-b border-neutral-graphite/60">
        <div className="pointer-events-none absolute inset-0 bg-radial-highlight opacity-40" />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 relative">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Cover */}
            <div className="relative overflow-hidden rounded-card border border-neutral-graphite bg-neutral-carbon shadow-2xl shadow-black/50">
              <div className="aspect-[16/9] w-full">
                <ProductCover
                  name={product.name}
                  shortName={product.shortName}
                  cover={product.cover}
                  coverTheme={product.coverTheme}
                  priority
                />
              </div>
              {product.badge && (
                <span className="absolute left-4 top-4 rounded-pill bg-brand-mint px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-void">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Buy panel */}
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-pill border border-neutral-smoke bg-neutral-carbon px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-mist">
                  {CATEGORY_LABELS[product.category]}
                </span>
                {product.status === "early-access" && (
                  <span className="rounded-pill border border-brand-cyan/40 bg-brand-cyan/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand-cyan">
                    Early Access
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-paper sm:text-4xl" style={{ letterSpacing: "-0.022em" }}>
                {product.name}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-neutral-fog">
                {product.tagline}
              </p>

              {/* Stats strip */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {product.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-card border border-neutral-graphite bg-neutral-carbon/80 px-4 py-3"
                  >
                    <div className="text-lg font-semibold text-neutral-paper">
                      {stat.value}
                    </div>
                    <div className="mt-0.5 text-[11px] leading-tight text-neutral-ash">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price + CTA */}
              <div className="mt-8 rounded-card border border-neutral-graphite bg-neutral-carbon/80 p-6">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-4xl font-semibold text-neutral-paper">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  {product.compareAt && (
                    <>
                      <span className="text-base text-neutral-ash line-through">
                        {formatPrice(product.compareAt, product.currency)}
                      </span>
                      <span className="rounded-pill bg-brand-mint/15 px-2.5 py-0.5 text-xs font-medium text-brand-mint">
                        Save {formatPrice(product.compareAt - product.price, product.currency)}
                      </span>
                    </>
                  )}
                  <span className="text-xs text-neutral-ash">
                    one-time · instant download
                  </span>
                </div>

                {product.commercialPrice && (
                  <p className="mt-2 text-xs text-neutral-fog">
                    Need agency rights? Choose the{" "}
                    <span className="font-medium text-neutral-mist">
                      Commercial License ({formatPrice(product.commercialPrice)})
                    </span>{" "}
                    at checkout — unlimited client deliverables + team sharing.
                  </p>
                )}

                {product.checkoutUrl ? (
                  <a
                    href={product.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-button bg-brand-mint px-6 py-3.5 text-sm font-semibold text-neutral-void transition-all hover:bg-brand-mint/90 active:scale-96 scale-on-press sm:w-auto"
                  >
                    <Download className="h-4 w-4" />
                    Buy now — {formatPrice(product.price, product.currency)}
                  </a>
                ) : (
                  <a
                    href="mailto:hello@agyflow.com?subject=Montessori%20Toddler%20Busy%20Book%20—%20early%20access"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-button border border-brand-cyan/50 bg-brand-cyan/10 px-6 py-3.5 text-sm font-semibold text-brand-cyan transition-all hover:bg-brand-cyan/20 active:scale-96 scale-on-press sm:w-auto"
                  >
                    Get early access
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}

                <p className="mt-4 font-mono text-[11px] leading-relaxed text-neutral-ash">
                  Secure checkout via Gumroad · VAT handled for EU buyers ·
                  Support: hello@agyflow.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="bg-surface-200 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main column */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-paper">
                What you get
              </h2>
              <ul className="mt-6 space-y-4">
                {product.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-[15px] leading-relaxed text-neutral-mist"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-brand-mint/40 bg-brand-mint/10">
                      <Check className="h-3 w-3 text-brand-mint" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-neutral-paper">
                About this product
              </h2>
              <div className="mt-6 space-y-4">
                {product.description.map((para, idx) => (
                  <p
                    key={idx}
                    className="text-[15px] leading-relaxed text-neutral-fog"
                  >
                    {para}
                  </p>
                ))}
              </div>

              {isBundle && product.includesProducts && (
                <div className="mt-10 rounded-card border border-brand-mint/25 bg-brand-mint/[0.04] p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-mint">
                    Included products
                  </h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {product.includesProducts.map((slug) => {
                      const included = getProductBySlug(slug);
                      if (!included) return null;
                      return (
                        <Link
                          key={slug}
                          href={`/products/${slug}`}
                          className="group flex items-center justify-between gap-3 rounded-button border border-neutral-graphite bg-neutral-carbon/70 px-4 py-3 transition-colors hover:border-neutral-smoke"
                        >
                          <span className="text-sm text-neutral-mist group-hover:text-neutral-paper">
                            {included.name}
                          </span>
                          <span className="font-mono text-xs text-neutral-ash">
                            {formatPrice(included.price)}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="mt-10 flex items-start gap-3 rounded-card border border-neutral-graphite bg-neutral-carbon/60 p-5">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-neutral-fog" />
                <p className="text-xs leading-relaxed text-neutral-ash">
                  {product.category === "education"
                    ? "For personal and classroom use. Reproduction for resale or commercial redistribution is not permitted."
                    : "This is a practical workflow toolkit, not legal advice, and it does not guarantee compliance with GDPR, the DSGVO, or any other law. Have qualified legal counsel review any document before formal use. Distributed under the included LICENSE.txt (Individual or Commercial tier, as purchased)."}
                </p>
              </div>
            </div>

            {/* Spec sidebar */}
            <aside>
              <div className="sticky top-24 space-y-4">
                <div className="rounded-card border border-neutral-graphite bg-neutral-carbon/80 p-6">
                  <h3 className="text-sm font-semibold text-neutral-paper">
                    Specifications
                  </h3>
                  <dl className="mt-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-neutral-ash" />
                      <div>
                        <dt className="text-[11px] uppercase tracking-wider text-neutral-ash">
                          Format
                        </dt>
                        <dd className="mt-0.5 text-sm text-neutral-mist">
                          {product.format.join(" · ")}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Languages className="mt-0.5 h-4 w-4 shrink-0 text-neutral-ash" />
                      <div>
                        <dt className="text-[11px] uppercase tracking-wider text-neutral-ash">
                          Languages
                        </dt>
                        <dd className="mt-0.5 text-sm text-neutral-mist">
                          {product.languages.join(" · ")}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="mt-0.5 h-4 w-4 shrink-0 text-neutral-ash" />
                      <div>
                        <dt className="text-[11px] uppercase tracking-wider text-neutral-ash">
                          For
                        </dt>
                        <dd className="mt-0.5 text-sm text-neutral-mist">
                          {product.audience}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Download className="mt-0.5 h-4 w-4 shrink-0 text-neutral-ash" />
                      <div>
                        <dt className="text-[11px] uppercase tracking-wider text-neutral-ash">
                          Delivery
                        </dt>
                        <dd className="mt-0.5 text-sm text-neutral-mist">
                          Instant download after checkout
                        </dd>
                      </div>
                    </div>
                  </dl>
                </div>

                {/* Cross-sell */}
                {!isBundle && (
                  <div className="rounded-card border border-brand-mint/25 bg-gradient-to-b from-brand-mint/[0.06] to-transparent p-6">
                    <h3 className="text-sm font-semibold text-neutral-paper">
                      Need all five?
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-neutral-fog">
                      Get the complete Agency Compliance Toolkit bundle — all
                      Tier 1 products in one download and save 54%.
                    </p>
                    <Link
                      href="/products/agency-compliance-toolkit"
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-mint transition-colors hover:text-neutral-paper"
                    >
                      View the bundle
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="border-t border-neutral-graphite/60 bg-neutral-void py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-paper">
                {isBundle ? "Everything in the bundle" : "You might also need"}
              </h2>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-mint transition-colors hover:text-neutral-paper"
              >
                <ArrowLeft className="hidden h-3.5 w-3.5" />
                Browse all products
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/products/${rel.slug}`}
                  className="group flex items-center gap-4 rounded-card border border-neutral-graphite bg-neutral-carbon/80 p-4 transition-all hover:border-neutral-smoke hover:bg-neutral-obsidian"
                >
                  <div className="h-20 w-32 shrink-0 overflow-hidden rounded-button border border-neutral-graphite">
                    <ProductCover
                      name={rel.name}
                      shortName={rel.shortName}
                      cover={rel.thumb ?? rel.cover}
                      coverTheme={rel.coverTheme}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-neutral-paper">
                      {rel.shortName}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-ash">
                      {rel.tagline}
                    </p>
                    <p className="mt-2 font-mono text-xs text-brand-mint">
                      {formatPrice(rel.price, rel.currency)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer lang="en" />
    </main>
  );
}
