import { MarketTicker } from "@/components/home/market-ticker";
import { FeaturedArticle } from "@/components/home/featured-article";
import { LatestPosts } from "@/components/home/latest-posts";
import { NepaliFinanceSection } from "@/components/home/nepali-finance-section";
import { Newsletter } from "@/components/home/newsletter";
import { Container } from "@/components/layout/container";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isNp = locale === "np";
  return buildPageMetadata({
    locale,
    title: isNp ? "लगानीफोरम | वित्तीय ज्ञान" : "Laganiforum | Finance & Trading",
    description: isNp
      ? "नेप्से, फरेक्स र व्यक्तिगत वित्त सम्बन्धी शैक्षिक विश्लेषण र बजार शिक्षा।"
      : "Educational NEPSE, forex, and personal finance analysis in English and Nepali.",
    path: "",
  });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="flex flex-col w-full">
      {/* Market Ticker spanning full width */}
      <MarketTicker locale={locale} />
      
      <Container className="py-8 sm:py-12 space-y-12 sm:space-y-16 md:space-y-20">
        {/* Featured Top Section */}
        <section>
          <FeaturedArticle locale={locale} />
        </section>

        {/* Latest Analysis Grid */}
        <LatestPosts locale={locale} />

        {/* Nepal Specific Content */}
        <NepaliFinanceSection locale={locale} />

        {/* Newsletter Capture */}
        <Newsletter locale={locale} />
      </Container>
    </div>
  );
}
