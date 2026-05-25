import type { Post } from "@/lib/posts";
import { postHasTag } from "@/lib/posts";
import type { TopicCluster } from "@/lib/seo/topics";
import type { StockEntity } from "@/lib/seo/stocks";

export function filterPostsByTopic(posts: Post[], topic: TopicCluster): Post[] {
  return posts.filter((post) => {
    const categoryMatch = topic.categories?.some(
      (c) => post.meta.category.toLowerCase() === c.toLowerCase()
    );
    const tagMatch = topic.tags?.some((t) => postHasTag(post, t));
    return categoryMatch || tagMatch;
  });
}

export function filterPostsByStock(posts: Post[], stock: StockEntity): Post[] {
  const keywords = [
    ...stock.keywords,
    stock.symbol.toLowerCase(),
    stock.slug.replace(/-/g, " "),
  ];

  return posts.filter((post) => {
    if (stock.tags.some((t) => postHasTag(post, t))) return true;

    const haystack = `${post.meta.title} ${post.meta.excerpt} ${(post.meta.tags ?? []).join(" ")}`.toLowerCase();
    return keywords.some((kw) => haystack.includes(kw.toLowerCase()));
  });
}
