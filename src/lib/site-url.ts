const PRODUCTION_ORIGIN = "https://laganiforum.com";

export function getSiteOrigin(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return PRODUCTION_ORIGIN;
}

export function getArticleUrl(locale: string, slug: string): string {
  return `${getSiteOrigin()}/${locale}/blog/${slug}`;
}

export function getAuthorUrl(locale: string, authorId: string): string {
  return `${getSiteOrigin()}/${locale}/author/${authorId}`;
}

export function getTopicUrl(locale: string, topicSlug: string): string {
  return `${getSiteOrigin()}/${locale}/topics/${topicSlug}`;
}

export function getStockUrl(locale: string, stockSlug: string): string {
  return `${getSiteOrigin()}/${locale}/stocks/${stockSlug}`;
}
