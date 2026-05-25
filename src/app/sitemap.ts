import { MetadataRoute } from "next";
import { collectAllSitemapUrls } from "@/lib/seo/sitemap-urls";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await collectAllSitemapUrls();
  return entries.map((e) => ({
    url: e.url,
    lastModified: e.lastModified,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));
}
