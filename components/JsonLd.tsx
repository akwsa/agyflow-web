import React from "react";
import { getDict, type Lang } from "@/lib/i18n";

export default function JsonLd({ lang = "en" }: { lang?: Lang }) {
  const t = getDict(lang);
  const jl = t.jsonld;

  const schemaOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Agyflow",
    "url": "https://agyflow.com",
    "logo": "https://agyflow.com/favicon.svg",
    "description": jl.orgDescription,
    "sameAs": [
      "https://twitter.com/agyflow",
      "https://github.com/agyflow"
    ]
  };

  const schemaSoftwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Agyflow Multi-Agent Suite",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "url": "https://agyflow.com",
    "description": jl.appDescription,
    "offers": [
      {
        "@type": "Offer",
        "name": jl.offers.starter,
        "price": "15.00",
        "priceCurrency": "USD",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "name": jl.offers.pro,
        "price": "29.00",
        "priceCurrency": "USD",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "name": jl.offers.agency,
        "price": "49.00",
        "priceCurrency": "USD",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "84",
      "reviewCount": "84"
    }
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": t.faq.items.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrganization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaSoftwareApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }}
      />
    </>
  );
}
