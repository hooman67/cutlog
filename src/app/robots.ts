import type { MetadataRoute } from "next";

const SITE_URL = "https://cutlog-two.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep authed/app-only and API surfaces out of the index.
        disallow: ["/api/", "/admin/", "/auth", "/history", "/log", "/import", "/machine", "/feedback"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
