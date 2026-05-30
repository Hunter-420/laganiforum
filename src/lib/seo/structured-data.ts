import type { AuthorProfile } from "@/lib/types/author";
import type { PostMeta } from "@/lib/mdx";
import { getSiteOrigin, getAuthorUrl, getArticleUrl } from "@/lib/site-url";

export function buildOrganizationSchema() {
  const origin = getSiteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Laganiforum",
    url: origin,
    // NOTE: was incorrectly /logo.svg — the actual file is logo.png
    logo: `${origin}/logo.png`,
    sameAs: ["https://www.facebook.com/agbibas"],
  };
}

export function buildBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildPersonSchema(author: AuthorProfile, locale: string) {
  const origin = getSiteOrigin();
  const profileUrl =
    author.id && author.id !== "unknown"
      ? getAuthorUrl(locale, author.id)
      : `${origin}/${locale}/about`;

  return {
    "@type": "Person",
    "@id": profileUrl,
    name: author.name,
    jobTitle: author.title,
    url: profileUrl,
    description: author.bio || undefined,
    // worksFor links the author back to the publisher — improves E-E-A-T signals
    worksFor: {
      "@type": "Organization",
      name: "Laganiforum",
      url: origin,
    },
    ...(author.photoUrl ? { image: author.photoUrl } : {}),
    ...(author.email ? { email: author.email } : {}),
    ...(() => {
      const sameAs = [author.facebookUrl, author.linkedinUrl, author.twitterUrl].filter(
        (url): url is string => Boolean(url?.trim())
      );
      return sameAs.length > 0 ? { sameAs } : {};
    })(),
  };
}

/**
 * Builds a SINGLE BlogPosting schema for an article page.
 *
 * Previously this emitted three overlapping schema types (Article + BlogPosting +
 * NewsArticle) for the same URL. Multiple @type schemas on the same page confuse
 * Google's Rich Results parser and can cause validation errors in Search Console.
 * BlogPosting is the most semantically correct type for an educational finance blog.
 */
export function buildArticleSchema(
  meta: PostMeta,
  locale: string,
  author: AuthorProfile,
  articleUrl: string
) {
  const origin = getSiteOrigin();
  const dateModified = meta.updatedAt || meta.date;

  const publisher = {
    "@type": "Organization" as const,
    name: "Laganiforum",
    url: origin,
    logo: {
      "@type": "ImageObject" as const,
      url: `${origin}/logo.png`,
    },
  };

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.excerpt,
    image: meta.image || undefined,
    author: buildPersonSchema(author, locale),
    publisher,
    datePublished: meta.date,
    dateModified,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    inLanguage: locale === "np" ? "ne" : "en",
    keywords: meta.tags?.join(", "),
    url: articleUrl,
  };
}

/**
 * @deprecated Use buildArticleSchema (singular) instead.
 * Kept for backwards-compatibility during migration — callers should update.
 */
export function buildArticleSchemas(
  meta: PostMeta,
  locale: string,
  author: AuthorProfile,
  articleUrl: string
) {
  return [buildArticleSchema(meta, locale, author, articleUrl)];
}

export function buildItemListSchema(
  name: string,
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}
