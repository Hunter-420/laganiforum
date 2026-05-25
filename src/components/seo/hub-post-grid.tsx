import { PostCard } from "@/components/blog/post-card";
import type { Post } from "@/lib/posts";

interface HubPostGridProps {
  posts: Post[];
  locale: string;
  emptyMessage: string;
}

export function HubPostGrid({ posts, locale, emptyMessage }: HubPostGridProps) {
  if (posts.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground border rounded-xl bg-muted/20">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {posts.map((post) => (
        <PostCard key={post.meta.slug} post={post} locale={locale} showTags />
      ))}
    </div>
  );
}
