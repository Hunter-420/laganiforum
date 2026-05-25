import type { Post } from "@/lib/posts";
import { getAllPublishedPosts, postHasTag } from "@/lib/posts";

function scoreRelated(current: Post, candidate: Post): number {
  if (current.meta.slug === candidate.meta.slug) return -1;

  let score = 0;
  if (
    current.meta.category &&
    candidate.meta.category.toLowerCase() === current.meta.category.toLowerCase()
  ) {
    score += 3;
  }

  const currentTags = new Set(
    (current.meta.tags ?? []).map((t) => t.trim().toLowerCase())
  );
  for (const tag of candidate.meta.tags ?? []) {
    if (currentTags.has(tag.trim().toLowerCase())) score += 2;
  }

  return score;
}

export async function getRelatedPosts(
  locale: string,
  current: Post,
  limit = 3
): Promise<Post[]> {
  const all = await getAllPublishedPosts(locale);

  const ranked = all
    .filter((p) => p.meta.slug !== current.meta.slug)
    .map((p) => ({ post: p, score: scoreRelated(current, p) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length >= limit) {
    return ranked.slice(0, limit).map((x) => x.post);
  }

  const sameCategory = all.filter(
    (p) =>
      p.meta.slug !== current.meta.slug &&
      p.meta.category.toLowerCase() === current.meta.category.toLowerCase()
  );

  const byTag = current.meta.tags?.length
    ? all.filter(
        (p) =>
          p.meta.slug !== current.meta.slug &&
          current.meta.tags!.some((t) => postHasTag(p, t))
      )
    : [];

  const merged = [...ranked.map((x) => x.post), ...byTag, ...sameCategory];
  const seen = new Set<string>();
  const result: Post[] = [];

  for (const post of merged) {
    if (seen.has(post.meta.slug)) continue;
    seen.add(post.meta.slug);
    result.push(post);
    if (result.length >= limit) break;
  }

  return result;
}
