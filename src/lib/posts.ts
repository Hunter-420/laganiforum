import { getDb } from "./db";
import { getPostBySlug as getMdxPostBySlug, getAllPosts as getAllMdxPosts } from "./mdx";
import type { PostMeta, Post } from "./mdx";

export type { PostMeta, Post };

export async function getPostLocalePath(
  slug: string,
  fromLocale: string,
  toLocale: string
): Promise<string | null> {
  if (fromLocale === toLocale) return `/${toLocale}/blog/${slug}`;

  try {
    const db = await getDb();
    const source = await db.collection("posts").findOne({
      slug,
      language: fromLocale,
      status: "published",
    });

    if (source?.translationGroupId) {
      const translated = await db.collection("posts").findOne({
        translationGroupId: source.translationGroupId,
        language: toLocale,
        status: "published",
      });
      if (translated) return `/${toLocale}/blog/${translated.slug}`;
    }

    const sameSlug = await db.collection("posts").findOne({
      slug,
      language: toLocale,
      status: "published",
    });
    if (sameSlug) return `/${toLocale}/blog/${slug}`;
  } catch {
    /* fall through */
  }

  const mdxPost = getMdxPostBySlug(slug, toLocale);
  if (mdxPost) return `/${toLocale}/blog/${slug}`;

  return null;
}

export async function getPublishedPostBySlug(
  slug: string,
  locale: string
): Promise<Post | null> {
  try {
    const db = await getDb();
    const doc = await db
      .collection("posts")
      .findOne({ slug, language: locale, status: "published" });

    if (doc) {
      const publishedDate = doc.createdAt
        ? new Date(doc.createdAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      const updatedAtIso = doc.updatedAt
        ? new Date(doc.updatedAt).toISOString()
        : doc.createdAt
          ? new Date(doc.createdAt).toISOString()
          : new Date().toISOString();

      return {
        meta: {
          title: doc.title,
          excerpt: doc.excerpt,
          date: publishedDate,
          updatedAt: updatedAtIso,
          category: doc.category,
          author: doc.author,
          tags: doc.tags || [],
          slug: doc.slug,
          locale: doc.language,
          image: doc.coverImage,
          coverImageAlt: doc.coverImageAlt,
          readingTime: computeReadingTime(doc.content),
          affiliate: doc.affiliate,
          disclaimer: doc.disclaimer,
          views: doc.views || 0,
          isFeatured: !!doc.isFeatured,
          createdAt: doc.createdAt
            ? new Date(doc.createdAt).toISOString()
            : undefined,
          _id: doc._id?.toString(),
        } as PostMeta,
        content: doc.content,
      };
    }
  } catch (err) {
    console.error("[posts] MongoDB fetch failed, falling back to MDX:", err);
  }

  return getMdxPostBySlug(slug, locale);
}

export async function getAllPublishedPosts(locale: string): Promise<Post[]> {
  const mdxPosts = getAllMdxPosts(locale);
  const mdxSlugs = new Set(mdxPosts.map((p) => p.meta.slug));

  let dbPosts: Post[] = [];
  try {
    const db = await getDb();
    const docs = await db
      .collection("posts")
      .find({ language: locale, status: "published" })
      .sort({ createdAt: -1 })
      .toArray();

    dbPosts = docs.map((doc) => {
      const publishedDate = doc.createdAt
        ? new Date(doc.createdAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      const updatedAtIso = doc.updatedAt
        ? new Date(doc.updatedAt).toISOString()
        : doc.createdAt
          ? new Date(doc.createdAt).toISOString()
          : new Date().toISOString();

      return {
        meta: {
          title: doc.title,
          excerpt: doc.excerpt,
          date: publishedDate,
          updatedAt: updatedAtIso,
          category: doc.category,
          author: doc.author,
          tags: doc.tags || [],
          slug: doc.slug,
          locale: doc.language,
          image: doc.coverImage,
          coverImageAlt: doc.coverImageAlt,
          readingTime: computeReadingTime(doc.content),
          affiliate: doc.affiliate,
          disclaimer: doc.disclaimer,
          views: doc.views || 0,
          isFeatured: !!doc.isFeatured,
          createdAt: doc.createdAt
            ? new Date(doc.createdAt).toISOString()
            : undefined,
          _id: doc._id?.toString(),
        } as PostMeta,
        content: doc.content,
      };
    });
  } catch (err) {
    console.error("[posts] MongoDB getAllPosts failed, falling back to MDX only:", err);
  }

  const dbSlugs = new Set(dbPosts.map((p) => p.meta.slug));
  const filteredMdx = mdxPosts.filter((p) => !dbSlugs.has(p.meta.slug));
  const merged = [...dbPosts, ...filteredMdx];

  return merged.sort((a, b) => {
    const ta = new Date(a.meta.createdAt || a.meta.date).getTime();
    const tb = new Date(b.meta.createdAt || b.meta.date).getTime();
    return tb - ta;
  });
}

export async function getFeaturedPost(locale: string): Promise<Post | null> {
  const posts = await getAllPublishedPosts(locale);
  return posts.find((p) => p.meta.isFeatured) || posts[0] || null;
}

export async function getLatestPosts(locale: string, limit = 3): Promise<Post[]> {
  const posts = await getAllPublishedPosts(locale);
  return posts.slice(0, limit);
}

export function postHasTag(post: Post, tag: string): boolean {
  const normalized = tag.trim().toLowerCase();
  return (post.meta.tags ?? []).some((t) => t.trim().toLowerCase() === normalized);
}

export async function getPostsByTag(
  locale: string,
  tag: string,
  limit = 4
): Promise<Post[]> {
  const posts = await getAllPublishedPosts(locale);
  return posts.filter((p) => postHasTag(p, tag)).slice(0, limit);
}

export async function getAllPublishedSlugs(
  locale: string
): Promise<string[]> {
  const mdxPosts = getAllMdxPosts(locale);
  const mdxSlugs = mdxPosts.map((p) => p.meta.slug);

  let dbSlugs: string[] = [];
  try {
    const db = await getDb();
    const docs = await db
      .collection("posts")
      .find(
        { language: locale, status: "published" },
        { projection: { slug: 1 } }
      )
      .toArray();
    dbSlugs = docs.map((d) => d.slug as string);
  } catch (err) {
    console.error("[posts] MongoDB slug fetch failed:", err);
  }

  return [...new Set([...dbSlugs, ...mdxSlugs])];
}

function computeReadingTime(content: string): string {
  if (!content) return "3";
  const text = content.replace(/<[^>]*>?/gm, "");
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / 200);
  return String(Math.max(1, minutes));
}
