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
    logo: `${origin}/logo.svg`,
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
    ...(author.photoUrl ? { image: author.photoUrl } : {}),
    ...(author.facebookUrl ? { sameAs: [author.facebookUrl] } : {}),
  };
}

export function buildArticleSchemas(
  meta: PostMeta,
  locale: string,
  author: AuthorProfile,
  articleUrl: string
) {
  const dateModified = meta.updatedAt || meta.date;
  const publisher = {
    "@type": "Organization" as const,
    name: "Laganiforum",
    url: getSiteOrigin(),
    logo: {
      "@type": "ImageObject" as const,
      url: `${getSiteOrigin()}/logo.svg`,
    },
  };

  const base = {
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
  };

  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      ...base,
      url: articleUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      ...base,
      url: articleUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      ...base,
      url: articleUrl,
    },
  ];
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
