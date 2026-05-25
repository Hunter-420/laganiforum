import { getAllPublishedPosts } from "@/lib/posts";
import { getSiteOrigin } from "@/lib/site-url";
import { TOPIC_CLUSTERS } from "@/lib/seo/topics";
import { STOCK_ENTITIES } from "@/lib/seo/stocks";
import { getSiteSettings } from "@/lib/site-settings";

const LOCALES = ["en", "np"] as const;
const TRUST_ROUTES = ["/about", "/contact", "/disclaimer"];
const STATIC_ROUTES = ["", "/blog", "/market"];

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

function entry(
  path: string,
  opts: Partial<Pick<SitemapEntry, "lastModified" | "changeFrequency" | "priority">> = {}
): SitemapEntry {
  return {
    url: `${getSiteOrigin()}${path}`,
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency ?? "weekly",
    priority: opts.priority ?? 0.7,
  };
}

export async function collectStaticUrls(): Promise<SitemapEntry[]> {
  const urls: SitemapEntry[] = [];

  for (const route of STATIC_ROUTES) {
    for (const locale of LOCALES) {
      urls.push(
        entry(`/${locale}${route}`, {
          changeFrequency: route === "" ? "daily" : "weekly",
          priority: route === "" ? 1 : 0.9,
        })
      );
    }
  }

  for (const route of TRUST_ROUTES) {
    for (const locale of LOCALES) {
      urls.push(
        entry(`/${locale}${route}`, {
          changeFrequency: "monthly",
          priority: 0.6,
        })
      );
    }
  }

  return urls;
}

export async function collectArticleUrls(): Promise<SitemapEntry[]> {
  const urls: SitemapEntry[] = [];

  for (const locale of LOCALES) {
    const posts = await getAllPublishedPosts(locale);
    for (const post of posts) {
      urls.push(
        entry(`/${locale}/blog/${post.meta.slug}`, {
          lastModified: new Date(post.meta.updatedAt || post.meta.date),
          changeFrequency: "weekly",
          priority: 0.8,
        })
      );
    }
  }

  return urls;
}

export async function collectCategoryUrls(): Promise<SitemapEntry[]> {
  const urls: SitemapEntry[] = [];

  for (const topic of TOPIC_CLUSTERS) {
    for (const locale of LOCALES) {
      urls.push(
        entry(`/${locale}/topics/${topic.slug}`, {
          changeFrequency: "weekly",
          priority: 0.75,
        })
      );
    }
  }

  return urls;
}

export async function collectStockUrls(): Promise<SitemapEntry[]> {
  const urls: SitemapEntry[] = [];

  for (const stock of STOCK_ENTITIES) {
    for (const locale of LOCALES) {
      urls.push(
        entry(`/${locale}/stocks/${stock.slug}`, {
          changeFrequency: "weekly",
          priority: 0.75,
        })
      );
    }
  }

  return urls;
}

export async function collectAuthorUrls(): Promise<SitemapEntry[]> {
  const settings = await getSiteSettings();
  const urls: SitemapEntry[] = [];

  for (const author of settings.authors) {
    if (!author.id?.trim() || !author.name.trim()) continue;
    for (const locale of LOCALES) {
      urls.push(
        entry(`/${locale}/author/${author.id}`, {
          changeFrequency: "monthly",
          priority: 0.65,
        })
      );
    }
  }

  return urls;
}

export async function collectAllSitemapUrls(): Promise<SitemapEntry[]> {
  const [staticUrls, articles, categories, stocks, authors] = await Promise.all([
    collectStaticUrls(),
    collectArticleUrls(),
    collectCategoryUrls(),
    collectStockUrls(),
    collectAuthorUrls(),
  ]);

  const seen = new Set<string>();
  const merged = [...staticUrls, ...articles, ...categories, ...stocks, ...authors];
  return merged.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

export function entriesToXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${e.url}</loc>
    <lastmod>${e.lastModified.toISOString()}</lastmod>
    <changefreq>${e.changeFrequency}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}
