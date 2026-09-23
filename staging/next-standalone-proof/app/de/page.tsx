import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import InteractiveAgentFlow from "@/components/InteractiveAgentFlow";
import BentoGrid from "@/components/BentoGrid";
import ProductSuite from "@/components/ProductSuite";
import PricingSection from "@/components/PricingSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getDict } from "@/lib/i18n";
import { loadProducts } from "@/lib/products";

const t = getDict("de");

export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
  keywords: t.meta.keywords,
  authors: [{ name: "Agyflow Team" }],
  creator: "Agyflow",
  publisher: "Agyflow",
  alternates: {
    canonical: "/de",
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
    url: "https://agyflow.com/de",
    siteName: "Agyflow",
    images: [
      {
        url: "/agyflow-brand.svg",
        width: 1600,
        height: 900,
        alt: "Agyflow Multi-Agent Platform",
      },
    ],
    locale: "de_DE",
    alternateLocale: ["en_US", "fr_FR"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: t.meta.ogTitle,
    description: t.meta.twitterDescription,
    images: ["/agyflow-brand.svg"],
  },
};

export default async function GermanHomePage() {
  const products = await loadProducts();
  return (
    <main className="min-h-[100dvh] bg-[#071224] text-slate-100 flex flex-col">
      <Navbar lang="de" />
      <Hero lang="de" />
      <InteractiveAgentFlow lang="de" />
      <BentoGrid lang="de" />
      <ProductSuite lang="de" products={products} />
      <PricingSection lang="de" />
      <FaqSection lang="de" />
      <Footer lang="de" products={products} />
      <JsonLd lang="de" />
    </main>
  );
}
