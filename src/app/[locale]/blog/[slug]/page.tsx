import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { getAllPublishedSlugs, getPublishedPostBySlug } from "@/lib/posts";
import { MDXRenderer } from "@/components/mdx-renderer";
import { ShareButtons } from "@/components/blog/share-buttons";
import { AffiliateBlock } from "@/components/article/affiliate-block";
import { ViewTracker } from "@/components/article/view-tracker";
import { Disclaimer } from "@/components/article/disclaimer";
import { AuthorByline } from "@/components/article/author-byline";
import { AuthorBio } from "@/components/article/author-bio";
import { RiskBanner } from "@/components/article/risk-banner";
import { RelatedPosts } from "@/components/article/related-posts";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { getArticleUrl, getSiteOrigin } from "@/lib/site-url";
import { getSiteSettings, resolveAuthor } from "@/lib/site-settings";
import { formatDisplayDate } from "@/lib/seo/metadata";
import { getRelatedPosts } from "@/lib/seo/related-posts";
import {
  buildArticleSchemas,
  buildBreadcrumbSchema,
} from "@/lib/seo/structured-data";
import { TOPIC_CLUSTERS, getTopicBySlug } from "@/lib/seo/topics";
import type { Metadata } from "next";
import type { AuthorProfile } from "@/lib/types/author";

export const revalidate = 3600;

export async function generateStaticParams() {
  const [enSlugs, npSlugs] = await Promise.all([
    getAllPublishedSlugs("en"),
    getAllPublishedSlugs("np"),
  ]);

  return [
    ...enSlugs.map((slug) => ({ locale: "en", slug })),
    ...npSlugs.map((slug) => ({ locale: "np", slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPublishedPostBySlug(slug, locale);

  if (!post) return {};

  const { meta } = post;
  const canonicalUrl = getArticleUrl(locale, slug);
  const modifiedTime = meta.updatedAt || meta.date;

  return {
    title: meta.title,
    description: meta.excerpt,
    authors: [{ name: meta.author }],
    category: meta.category,
    openGraph: {
      title: meta.title,
      description: meta.excerpt,
      type: "article",
      url: canonicalUrl,
      publishedTime: meta.date,
      modifiedTime,
      authors: [meta.author],
      tags: meta.tags,
      locale: locale === "np" ? "ne_NP" : "en_US",
      images: meta.image ? [{ url: meta.image, alt: meta.coverImageAlt || meta.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.excerpt,
      images: meta.image ? [meta.image] : [],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": `/en/blog/${slug}`,
        "ne-NP": `/np/blog/${slug}`,
      },
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPublishedPostBySlug(slug, locale);

  if (!post) notFound();

  const { meta, content } = post;
  const isNp = locale === "np";
  const settings = await getSiteSettings();
  const authorProfile: AuthorProfile =
    resolveAuthor(settings.authors, meta.author) ?? {
      id: "unknown",
      name: meta.author,
      title: isNp ? "बजार विश्लेषक" : "Market Analyst",
    };

  const articleUrl = getArticleUrl(locale, slug);
  const dateModified = meta.updatedAt || meta.date;
  const publishedLabel = formatDisplayDate(meta.date, locale);
  const updatedLabel = formatDisplayDate(dateModified, locale);
  const updatedDateOnly = new Date(dateModified).toISOString().split("T")[0];
  const showUpdated = Boolean(meta.updatedAt && updatedDateOnly !== meta.date);

  const homeLabel = isNp ? "गृहपृष्ठ" : "Home";
  const analysisLabel = isNp ? "बजार विश्लेषण" : "Analysis";

  const relatedPosts = await getRelatedPosts(locale, post, 3);

  const articleSchemas = buildArticleSchemas(meta, locale, authorProfile, articleUrl);
  const breadcrumbLd = buildBreadcrumbSchema([
    { name: homeLabel, url: `${getSiteOrigin()}/${locale}` },
    { name: analysisLabel, url: `${getSiteOrigin()}/${locale}/blog` },
    { name: meta.title, url: articleUrl },
  ]);

  const topicLink =
    TOPIC_CLUSTERS.find((t) =>
      t.categories?.some((c) => c.toLowerCase() === meta.category.toLowerCase())
    ) || (meta.tags?.[0] ? getTopicBySlug(meta.tags[0].toLowerCase().replace(/\s+/g, "-")) : undefined);

  return (
    <>
      {articleSchemas.map((schema) => (
        <JsonLd key={schema["@type"] as string} data={schema} />
      ))}
      <JsonLd data={breadcrumbLd} />

      <ViewTracker slug={slug} locale={locale} />

      <Breadcrumbs
        className="mb-6"
        items={[
          { label: homeLabel, href: `/${locale}` },
          { label: analysisLabel, href: `/${locale}/blog` },
          { label: meta.title },
        ]}
      />

      <Link
        href={`/${locale}/blog`}
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {isNp ? "सबै पोस्टहरूमा फर्कनुहोस्" : "Back to all posts"}
      </Link>

      <header className="mb-12">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
            {meta.category}
          </Badge>
          <time dateTime={meta.date} className="text-sm text-muted-foreground font-medium">
            {isNp ? "प्रकाशित: " : "Published: "}
            {publishedLabel}
          </time>
          {showUpdated && (
            <time dateTime={dateModified} className="text-sm text-muted-foreground font-medium">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mx-1 inline-block align-middle" />
              {isNp ? "अद्यावधिक: " : "Updated: "}
              {updatedLabel}
            </time>
          )}
          {meta.readingTime && (
            <span className="text-sm text-muted-foreground font-medium flex items-center">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mx-2" />
              {meta.readingTime} {isNp ? "मिनेट पढाइ" : "min read"}
            </span>
          )}
        </div>

        {meta.image && (
          <figure className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 bg-muted">
            <Image
              src={meta.image}
              alt={meta.coverImageAlt || meta.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 768px"
              className="object-cover"
            />
          </figure>
        )}

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
          {meta.title}
        </h1>

        <p className="text-xl text-muted-foreground leading-relaxed mb-8">{meta.excerpt}</p>

        <div className="flex flex-col gap-6 py-6 border-y border-border sm:flex-row sm:items-center sm:justify-between">
          <AuthorByline author={authorProfile} locale={locale} />
          <ShareButtons locale={locale} title={meta.title} articleUrl={articleUrl} />
        </div>
      </header>

      <RiskBanner locale={locale} />

      <section id="article-content" className="max-w-none prose-spacing">
        <MDXRenderer source={content} />
      </section>

      <AuthorBio author={authorProfile} locale={locale} fromDatabase={authorProfile.id !== "unknown"} />

      <RelatedPosts posts={relatedPosts} locale={locale} />

      {topicLink && (
        <nav className="sr-only" aria-label={isNp ? "सम्बन्धित विषय" : "Related topics"}>
          <Link href={`/${locale}/topics/${topicLink.slug}`}>
            {isNp ? topicLink.titleNp : topicLink.titleEn}
          </Link>
        </nav>
      )}

      {meta.affiliate && <AffiliateBlock affiliate={meta.affiliate} locale={locale} />}

      <Disclaimer locale={locale} />

      {meta.tags && meta.tags.length > 0 && (
        <footer className="mt-12 flex flex-wrap gap-2">
          {meta.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </footer>
      )}
    </>
  );
}
