import { collectStockUrls, entriesToXml } from "@/lib/seo/sitemap-urls";

export const revalidate = 300;

export async function GET() {
  const entries = await collectStockUrls();
  const xml = entriesToXml(entries);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
