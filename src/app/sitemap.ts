import type { MetadataRoute } from "next";
import { SEO_SETTINGS, SEO_CONTENT_LAST_UPDATED } from "@/data/seo-settings";

const SITE_URL = "https://cutlog-two.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(SEO_CONTENT_LAST_UPDATED);

  const corePages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/landing`, lastModified, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/settings`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/suggest`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/terms`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];

  const settingPages: MetadataRoute.Sitemap = SEO_SETTINGS.map((s) => ({
    url: `${SITE_URL}/settings/${s.slug}`,
    lastModified,
    changeFrequency: "monthly",
    // Prioritize industrial thick-metal cutting pages.
    priority: s.industrial ? 0.8 : 0.6,
  }));

  return [...corePages, ...settingPages];
}
