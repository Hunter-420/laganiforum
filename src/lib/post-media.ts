import type { AffiliateBlock } from "@/lib/types/db";

/** Extract image src URLs from HTML content. */
export function extractImageUrlsFromHtml(html: string): string[] {
  if (!html) return [];
  const urls: string[] = [];
  const patterns = [
    /src=["']([^"']+)["']/gi,
    /<img[^>]+src=["']([^"']+)["']/gi,
  ];
  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const url = match[1]?.trim();
      if (url && !url.startsWith("data:")) urls.push(url);
    }
  }
  return [...new Set(urls)];
}

export interface PostMediaFields {
  coverImage?: string;
  content?: string;
  affiliate?: AffiliateBlock | null;
}

/** All media URLs referenced by a post (cover, affiliate, inline images). */
export function collectPostMediaUrls(post: PostMediaFields): string[] {
  const urls = new Set<string>();

  if (post.coverImage?.trim()) urls.add(post.coverImage.trim());
  if (post.affiliate?.image?.trim()) urls.add(post.affiliate.image.trim());

  for (const url of extractImageUrlsFromHtml(post.content || "")) {
    urls.add(url);
  }

  return [...urls];
}

/** URLs present in old post but not in the updated post. */
export function diffRemovedMediaUrls(
  previous: PostMediaFields,
  next: PostMediaFields
): string[] {
  const prevKeys = new Set(
    collectPostMediaUrls(previous)
      .map((u) => u)
      .filter(Boolean)
  );
  const nextSet = new Set(collectPostMediaUrls(next));

  return [...prevKeys].filter((url) => !nextSet.has(url));
}
