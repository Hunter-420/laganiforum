import { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/login"],
    },
    sitemap: [
      `${origin}/sitemap.xml`,
      `${origin}/news-sitemap.xml`,
      `${origin}/category-sitemap.xml`,
      `${origin}/stocks-sitemap.xml`,
    ],
  };
}
