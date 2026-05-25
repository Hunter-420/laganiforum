import { PostCard } from "@/components/blog/post-card";
import type { Post } from "@/lib/posts";

interface RelatedPostsProps {
  posts: Post[];
  locale: string;
}

export function RelatedPosts({ posts, locale }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  const isNp = locale === "np";

  return (
    <section className="mt-12 pt-8 border-t border-border" aria-labelledby="related-posts-heading">
      <h2 id="related-posts-heading" className="text-2xl font-bold tracking-tight mb-6">
        {isNp ? "सम्बन्धित विश्लेषण" : "Related analysis"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {posts.map((post) => (
          <PostCard key={post.meta.slug} post={post} locale={locale} showTags />
        ))}
      </div>
    </section>
  );
}
