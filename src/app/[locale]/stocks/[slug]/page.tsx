import { redirectToLocaleHome } from "@/lib/navigation";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { HubPostGrid } from "@/components/seo/hub-post-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildItemListSchema } from "@/lib/seo/structured-data";
import { filterPostsByStock } from "@/lib/seo/filter-posts";
import { STOCK_ENTITIES, getStockBySlug } from "@/lib/seo/stocks";
import { getAllPublishedPosts } from "@/lib/posts";
import { getSiteOrigin, getStockUrl } from "@/lib/site-url";
import type { Metadata } from "next";

export const revalidate = 300;

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of ["en", "np"]) {
    for (const stock of STOCK_ENTITIES) {
      params.push({ locale, slug: stock.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const stock = getStockBySlug(slug);
  if (!stock) return { robots: { index: false, follow: false } };

  const allPosts = await getAllPublishedPosts(locale);
  const posts = filterPostsByStock(allPosts, stock);
  
  const isNp = locale === "np";
  const name = isNp ? stock.nameNp : stock.nameEn;
  const base = buildPageMetadata({
    locale,
    title: `${name} (${stock.symbol})`,
    description: isNp
      ? `${name} सम्बन्धी नेप्से विश्लेषण, समाचार, र शैक्षिक सामग्री।`
      : `NEPSE analysis, news, and educational content about ${stock.nameEn} (${stock.symbol}).`,
    path: `/stocks/${slug}`,
  });

  if (posts.length === 0) {
    return { ...base, robots: { index: false, follow: true } };
  }

  return base;
}

export default async function StockPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const stock = getStockBySlug(slug);
  if (!stock) redirectToLocaleHome(locale);

  const isNp = locale === "np";
  const name = isNp ? stock.nameNp : stock.nameEn;
  const sector = isNp ? stock.sectorNp : stock.sectorEn;
  const homeLabel = isNp ? "गृहपृष्ठ" : "Home";
  const stocksLabel = isNp ? "शेयर" : "Stocks";

  const allPosts = await getAllPublishedPosts(locale);
  const posts = filterPostsByStock(allPosts, stock);
  const stockUrl = getStockUrl(locale, slug);

  const breadcrumbLd = buildBreadcrumbSchema([
    { name: homeLabel, url: `${getSiteOrigin()}/${locale}` },
    { name: stocksLabel, url: `${getSiteOrigin()}/${locale}/topics/nepse` },
    { name: name, url: stockUrl },
  ]);

  const itemListLd = buildItemListSchema(
    name,
    posts.slice(0, 12).map((p) => ({
      name: p.meta.title,
      url: `${getSiteOrigin()}/${locale}/blog/${p.meta.slug}`,
    }))
  );

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: isNp ? `${name} को प्रतीक के हो?` : `What is the symbol for ${name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: stock.symbol,
        },
      },
      {
        "@type": "Question",
        name: isNp ? `${name} कुन क्षेत्र अन्तर्गत पर्दछ?` : `Which sector does ${name} belong to?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: sector,
        },
      },
    ],
  };

  return (
    <Container className="py-8 md:py-12">
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={itemListLd} />
      <JsonLd data={faqLd} />

      <Breadcrumbs
        className="mb-6"
        items={[
          { label: homeLabel, href: `/${locale}` },
          { label: stocksLabel, href: `/${locale}/topics/nepse` },
          { label: name },
        ]}
      />

      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          {name}{" "}
          <span className="text-muted-foreground font-semibold">({stock.symbol})</span>
        </h1>
        <p className="text-sm text-primary font-medium mb-3">{sector}</p>
        <div className="prose-spacing text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {isNp ? (
            <>
              <p>
                {name} सम्बन्धी शैक्षिक विश्लेषण र बजार सामग्री। यो पृष्ठमा तपाईंले 
                यस कम्पनीसँग सम्बन्धित प्राविधिक विश्लेषण, वित्तीय रिपोर्टहरू, र बजार अद्यावधिकहरू 
                पाउन सक्नुहुन्छ।
              </p>
              <p>
                <strong>अस्वीकरण:</strong> यहाँ प्रस्तुत गरिएका सामग्रीहरू केवल शैक्षिक 
                प्रयोजनका लागि हुन् र यसलाई लगानी सिफारिसको रूपमा लिनु हुँदैन।
              </p>
            </>
          ) : (
            <>
              <p>
                Educational analysis and market content related to {stock.nameEn}. On this page, 
                you can find technical analysis, financial reports, and market updates concerning 
                this company.
              </p>
              <p>
                <strong>Disclaimer:</strong> The content provided here is for educational 
                purposes only and should not be considered as investment advice.
              </p>
            </>
          )}
        </div>
      </header>

      <section aria-labelledby="stock-posts-heading">
        <h2 id="stock-posts-heading" className="sr-only">
          {isNp ? "सम्बन्धित लेखहरू" : "Related posts"}
        </h2>
        <HubPostGrid
          posts={posts}
          locale={locale}
          emptyMessage={
            isNp
              ? "यो शेयरसँग सम्बन्धित लेख छैन। बजार विश्लेषण हेर्नुहोस्।"
              : "No articles tagged for this stock yet. Browse market analysis."
          }
        />
      </section>
    </Container>
  );
}
