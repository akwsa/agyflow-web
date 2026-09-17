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

const t = getDict("fr");

export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
  keywords: t.meta.keywords,
  authors: [{ name: "Agyflow Team" }],
  creator: "Agyflow",
  publisher: "Agyflow",
  alternates: {
    canonical: "/fr",
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
    url: "https://agyflow.com/fr",
    siteName: "Agyflow",
    images: [
      {
        url: "/agyflow-brand.svg",
        width: 1600,
        height: 900,
        alt: "Agyflow Multi-Agent Platform",
      },
    ],
    locale: "fr_FR",
    alternateLocale: ["en_US", "de_DE"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: t.meta.ogTitle,
    description: t.meta.twitterDescription,
    images: ["/agyflow-brand.svg"],
  },
};

export default function FrenchHomePage() {
  return (
    <main className="min-h-[100dvh] bg-[#071224] text-slate-100 flex flex-col">
      <Navbar lang="fr" />
      <Hero lang="fr" />
      <InteractiveAgentFlow lang="fr" />
      <BentoGrid lang="fr" />
      <ProductSuite lang="fr" />
      <PricingSection lang="fr" />
      <FaqSection lang="fr" />
      <Footer lang="fr" />
      <JsonLd lang="fr" />
    </main>
  );
}
