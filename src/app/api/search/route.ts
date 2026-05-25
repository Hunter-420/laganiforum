import { NextResponse } from "next/server";
import { getAllPublishedPosts } from "@/lib/posts";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim().toLowerCase();
  const locale = searchParams.get("locale") || "en";

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const posts = await getAllPublishedPosts(locale);
  const results = posts
    .filter((post) => {
      const haystack = [
        post.meta.title,
        post.meta.excerpt,
        post.meta.category,
        ...(post.meta.tags || []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    })
    .slice(0, 12)
    .map((post) => ({
      title: post.meta.title,
      excerpt: post.meta.excerpt,
      slug: post.meta.slug,
      category: post.meta.category,
      date: post.meta.date,
      href: `/${locale}/blog/${post.meta.slug}`,
    }));

  return NextResponse.json({ results });
}
