import { preload } from "react-dom";
import { MarketTicker } from "@/components/home/market-ticker";
import { FeaturedArticle } from "@/components/home/featured-article";
import { LatestPosts } from "@/components/home/latest-posts";
import { NepaliFinanceSection } from "@/components/home/nepali-finance-section";
import { Newsletter } from "@/components/home/newsletter";
import { Container } from "@/components/layout/container";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getFeaturedPost } from "@/lib/posts";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isNp = locale === "np";
  const featured = await getFeaturedPost(locale);
  const base = buildPageMetadata({
    locale,
    title: isNp ? "लगानीफोरम | वित्तीय ज्ञान" : "Laganiforum | Finance & Trading",
    description: isNp
      ? "नेप्से, फरेक्स र व्यक्तिगत वित्त सम्बन्धी शैक्षिक विश्लेषण र बजार शिक्षा।"
      : "Educational NEPSE, forex, and personal finance analysis in English and Nepali.",
    path: "",
  });

  if (!featured?.meta.image) return base;

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      images: [
        {
          url: featured.meta.image,
          alt: featured.meta.coverImageAlt || featured.meta.title,
        },
      ],
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const featured = await getFeaturedPost(locale);

  if (featured?.meta.image) {
    preload(featured.meta.image, {
      as: "image",
      fetchPriority: "high",
    });
  }

  return (
    <div className="flex flex-col w-full">
      <MarketTicker locale={locale} />

      <Container className="py-8 sm:py-12 space-y-12 sm:space-y-16 md:space-y-20">
        <section>
          <FeaturedArticle locale={locale} />
        </section>

        <LatestPosts locale={locale} />

        <NepaliFinanceSection locale={locale} />

        <Newsletter locale={locale} />
      </Container>
    </div>
  );
}
