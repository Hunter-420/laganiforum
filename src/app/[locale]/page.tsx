import { preload } from "react-dom";
import dynamic from "next/dynamic";
import { FeaturedArticle } from "@/components/home/featured-article";
import { Container } from "@/components/layout/container";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getFeaturedPost } from "@/lib/posts";
import { getLcpPreloadHref, toAbsoluteImageUrl } from "@/lib/lcp-image";
import type { Metadata } from "next";

const LatestPosts = dynamic(
  () => import("@/components/home/latest-posts").then((m) => ({ default: m.LatestPosts })),
  { loading: () => <div className="h-96 rounded-xl bg-muted/30 animate-pulse" aria-hidden /> }
);

const NepaliFinanceSection = dynamic(
  () =>
    import("@/components/home/nepali-finance-section").then((m) => ({
      default: m.NepaliFinanceSection,
    })),
  { loading: () => <div className="h-80 rounded-xl bg-muted/30 animate-pulse" aria-hidden /> }
);

const Newsletter = dynamic(
  () => import("@/components/home/newsletter").then((m) => ({ default: m.Newsletter })),
  { loading: () => <div className="h-64 rounded-2xl bg-muted/30 animate-pulse" aria-hidden /> }
);

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
          url: toAbsoluteImageUrl(featured.meta.image),
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
  const lcpHref = featured?.meta.image
    ? getLcpPreloadHref(featured.meta.image)
    : null;

  if (lcpHref) {
    preload(lcpHref, { as: "image", fetchPriority: "high" });
  }

  return (
    <>
      <div className="flex flex-col w-full">
        <Container className="pt-6 sm:pt-8 pb-0">
          <section id="hero-featured" aria-label={locale === "np" ? "विशेष लेख" : "Featured article"}>
            <FeaturedArticle locale={locale} featured={featured} />
          </section>
        </Container>

        <Container className="py-8 sm:py-12 space-y-12 sm:space-y-16 md:space-y-20">
          <LatestPosts locale={locale} />
          <NepaliFinanceSection locale={locale} />
          <Newsletter locale={locale} />
        </Container>
      </div>
    </>
  );
}
