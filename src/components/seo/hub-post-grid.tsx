import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import type { Post } from "@/lib/posts";

interface HubPostGridProps {
  posts: Post[];
  locale: string;
  emptyMessage: string;
}

export function HubPostGrid({ posts, locale, emptyMessage }: HubPostGridProps) {
  const isNp = locale === "np";

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
        <Link
          key={post.meta.slug}
          href={`/${locale}/blog/${post.meta.slug}`}
          className="block group"
        >
          <Card className="h-full flex flex-col transition-all hover:border-primary/50 hover:shadow-md">
            <CardHeader className="flex-1 pb-4">
              <div className="flex justify-between items-center mb-3">
                <Badge variant="outline" className="text-xs font-medium">
                  {post.meta.category}
                </Badge>
                <span className="text-xs text-muted-foreground">{post.meta.date}</span>
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                {post.meta.title}
              </CardTitle>
              <CardDescription className="line-clamp-3 mt-2">{post.meta.excerpt}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-0 text-sm text-muted-foreground font-medium">
              {isNp ? `लेखक: ${post.meta.author}` : `By ${post.meta.author}`}
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
