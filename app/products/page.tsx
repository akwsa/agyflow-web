import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCatalog from "@/components/ProductCatalog";
import { loadProducts, formatPrice } from "@/lib/products";

export const metadata: Metadata = {
  title: "Digital Products — Compliance, Operations & AI Governance Toolkits | Agyflow",
  description:
    "Instant-download toolkits for web freelancers and agencies: GDPR/DSGVO checklists, cookie audit spreadsheets, invoice reminder emails, client onboarding kits, and AI usage policies. EN / DE / FR.",
  keywords: [
    "digital products",
    "GDPR checklist",
    "cookie audit",
    "invoice reminders",
    "client onboarding",
    "AI policy",
    "agency toolkit",
    "Agyflow",
  ],
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Agyflow Digital Products — Compliance & Operations Toolkits",
    description:
      "Instant-download toolkits for web freelancers and agencies. GDPR checklists, cookie audits, invoice reminders, onboarding kits, and AI policies.",
    url: "https://agyflow.com/products",
    siteName: "Agyflow",
    images: ["/agyflow-brand.svg"],
    locale: "en_US",
    type: "website",
  },
};

export default async function ProductsPage() {
  const products = await loadProducts();
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
              Instant Download · Gumroad Checkout · EN / DE / FR
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-paper sm:text-5xl" style={{ letterSpacing: "-0.022em" }}>
              Digital Products
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-fog">
              Practical, ready-to-use toolkits for web freelancers, agencies, and
              small businesses. Built for the EU market with English, German, and
              French materials — from {" "}
              <span className="font-mono text-neutral-mist">{formatPrice(cheapest)}</span>.
              One-time purchase, yours forever.
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

      <Footer lang="en" products={products} />
    </main>
  );
}
