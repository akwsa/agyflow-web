import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCatalog from "@/components/ProductCatalog";
import AgencyComplianceTrustLayer from "@/components/AgencyComplianceTrustLayer";
import { loadProducts, formatPrice } from "@/lib/products";

export const metadata: Metadata = {
  title: "EU Website Launch Readiness Kit | Agyflow",
  description:
    "A practical pre-launch review kit for web freelancers and small agencies serving EU clients.",
  keywords: [
    "website launch checklist",
    "GDPR checklist",
    "cookie audit workbook",
    "web agency toolkit",
    "EU website compliance",
    "Agyflow",
  ],
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Agyflow EU Website Launch Readiness Kit",
    description:
      "Find website launch blockers, document the work, and give clients a clear next step.",
    url: "https://agyflow.com/products",
    siteName: "Agyflow",
    images: ["/agyflow-brand.svg"],
    locale: "en_US",
    type: "website",
  },
};

export default async function ProductsPage() {
  const products = (await loadProducts()).filter(
    (product) => product.status === "live" && product.category !== "education",
  );
  const cheapest = Math.min(...products.map((p) => p.price));

  return (
    <main className="min-h-[100dvh] bg-neutral-void text-slate-100 flex flex-col">
      <Navbar lang="en" />

      {/* Page header */}
      <section className="relative overflow-hidden border-b border-neutral-graphite/60 bg-neutral-void py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-radial-highlight opacity-60" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <span className="font-mono text-xs tracking-widest text-brand-mint uppercase">
              EU website launch workflow · Gumroad checkout · EN / DE / FR
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-paper sm:text-5xl" style={{ letterSpacing: "-0.022em" }}>
              A clearer client handoff before the website goes live
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-fog">
              Start with the $9 checklist, buy the complete $29 kit, or choose
              the $59 agency license when you use the workflow in client work.
              Supporting files are available separately when you need one part of the process. Prices start at{" "}
              <span className="font-mono text-neutral-mist">{formatPrice(cheapest)}</span>.
              One-time purchase with instant delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="flex-1 bg-surface-200 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductCatalog products={products} />
        </div>
      </section>

      <AgencyComplianceTrustLayer />

      <Footer lang="en" products={products} />
    </main>
  );
}
