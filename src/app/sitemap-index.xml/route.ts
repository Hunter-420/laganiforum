import { getSiteOrigin } from "@/lib/site-url";

export const revalidate = 3600;

export async function GET() {
  const origin = getSiteOrigin();
  const now = new Date().toISOString();

  const sitemaps = [
    { loc: `${origin}/sitemap.xml`, lastmod: now },
    { loc: `${origin}/news-sitemap.xml`, lastmod: now },
    { loc: `${origin}/category-sitemap.xml`, lastmod: now },
    { loc: `${origin}/stocks-sitemap.xml`, lastmod: now },
    { loc: `${origin}/author-sitemap.xml`, lastmod: now },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(s => `  <sitemap>\n    <loc>${s.loc}</loc>\n    <lastmod>${s.lastmod}</lastmod>\n  </sitemap>`).join("\n")}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
