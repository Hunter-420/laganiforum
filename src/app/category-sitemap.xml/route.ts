import { collectCategoryUrls, entriesToXml } from "@/lib/seo/sitemap-urls";

export const revalidate = 3600;

export async function GET() {
  const entries = await collectCategoryUrls();
  const xml = entriesToXml(entries);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
