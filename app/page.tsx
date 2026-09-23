import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import InteractiveAgentFlow from "@/components/InteractiveAgentFlow";
import BentoGrid from "@/components/BentoGrid";
import ProductSuite from "@/components/ProductSuite";
import AgencyComplianceTrustLayer from "@/components/AgencyComplianceTrustLayer";
import PricingSection from "@/components/PricingSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getDict } from "@/lib/i18n";
import { loadProducts } from "@/lib/products";

const t = getDict("en");

export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
  keywords: t.meta.keywords,
  authors: [{ name: "Agyflow Team" }],
  creator: "Agyflow",
  publisher: "Agyflow",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      de: "/de",
      fr: "/fr",
      "x-default": "/",
    },
  },
  openGraph: {
    title: t.meta.ogTitle,
    description: t.meta.ogDescription,
    url: "https://agyflow.com",
    siteName: "Agyflow",
    images: [
      {
        url: "/agyflow-brand.svg",
        width: 1600,
        height: 900,
        alt: "Agyflow Multi-Agent Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: t.meta.ogTitle,
    description: t.meta.twitterDescription,
    images: ["/agyflow-brand.svg"],
  },
};

export default async function HomePage() {
  const products = await loadProducts();
  return (
    <main className="min-h-[100dvh] bg-[#071224] text-slate-100 flex flex-col">
      <Navbar lang="en" />
      <Hero lang="en" />
      <InteractiveAgentFlow lang="en" />
      <BentoGrid lang="en" />
      <ProductSuite lang="en" products={products} />
      <AgencyComplianceTrustLayer />
      <PricingSection lang="en" />
      <FaqSection lang="en" />
      <Footer lang="en" products={products} />
      <JsonLd lang="en" />
    </main>
  );
}
