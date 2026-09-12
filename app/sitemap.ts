import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://agyflow.com";
  const now = new Date();

  const languages = {
    en: baseUrl,
    de: `${baseUrl}/de`,
    fr: `${baseUrl}/fr`,
  };

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
  ];
}
