import { MetadataRoute } from "next";
import { collectStaticUrls, collectArticleUrls } from "@/lib/seo/sitemap-urls";

// Revalidate hourly. Previously this used `force-dynamic` which re-ran ALL
// database queries on every Googlebot hit — a crawl-budget and DB-load killer.
// Stocks, categories, and authors have their own dedicated sitemap routes.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [staticUrls, articles] = await Promise.all([
    collectStaticUrls(),
    collectArticleUrls(),
  ]);

  const seen = new Set<string>();
  const merged = [...staticUrls, ...articles];

  return merged
    .filter((item) => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    })
    .map((e) => ({
      url: e.url,
      lastModified: e.lastModified,
      changeFrequency: e.changeFrequency,
      priority: e.priority,
    }));
}
