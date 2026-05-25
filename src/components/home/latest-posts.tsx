import Link from "next/link";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { getLatestPosts } from "@/lib/posts";

export async function LatestPosts({ locale = "en" }: { locale?: string }) {
  const isNp = locale === "np";
  const posts = await getLatestPosts(locale, 3);

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {isNp ? "नवीनतम विश्लेषण" : "Latest Analysis"}
        </h2>
        <Link
          href={`/${locale}/blog`}
          className="text-sm font-medium text-primary hover:underline flex items-center"
        >
          {isNp ? "सबै हेर्नुहोस्" : "View all"}
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {posts.map((post) => (
          <Link
            key={post.meta.slug}
            href={`/${locale}/blog/${post.meta.slug}`}
            className="block group"
          >
            <Card className="h-full flex flex-col transition-all hover:border-primary/50 hover:shadow-md">
              <div className="h-48 w-full bg-muted rounded-t-xl overflow-hidden relative">
                {post.meta.image ? (
                  <OptimizedImage
                    src={post.meta.image}
                    alt={post.meta.coverImageAlt || post.meta.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 group-hover:scale-105 transition-transform duration-500" />
                )}
              </div>
              <CardHeader className="flex-1 pb-4">
                <div className="flex justify-between items-center mb-3">
                  <Badge variant="secondary" className="text-xs font-medium">
                    {post.meta.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{post.meta.date}</span>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                  {post.meta.title}
                </CardTitle>
                <CardDescription className="line-clamp-3 mt-2">
                  {post.meta.excerpt}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-0 text-sm text-muted-foreground font-medium">
                {isNp ? `लेखक: ${post.meta.author}` : `By ${post.meta.author}`}
              </CardFooter>
            </Card>
          </Link>
        ))}
        {posts.length === 0 && (
          <div className="col-span-3 text-center py-12 text-muted-foreground border rounded-xl bg-muted/20">
            {isNp ? "कुनै पनि पोस्ट फेला परेन।" : "No posts found."}
          </div>
        )}
      </div>
    </section>
  );
}
