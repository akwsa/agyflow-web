import { MetadataRoute } from "next";
import { loadProducts } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://agyflow.com";
  const now = new Date();

  const languages = {
    en: baseUrl,
    de: `${baseUrl}/de`,
    fr: `${baseUrl}/fr`,
  };

  const productPages: MetadataRoute.Sitemap = (await loadProducts()).map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: product.featured ? 0.9 : 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
      alternates: { languages },
    },
    {
      url: `${baseUrl}/de`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: { languages },
    },
    {
      url: `${baseUrl}/fr`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: { languages },
    },
    {
      url: `${baseUrl}/products`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    ...productPages,
  ];
}
