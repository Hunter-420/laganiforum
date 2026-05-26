import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { blogCategoryUrl, blogTagUrl } from "@/lib/tag-url";
import { formatDisplayDate } from "@/lib/seo/metadata";
import type { Post } from "@/lib/posts";

interface PostCardProps {
  post: Post;
  locale: string;
  showTags?: boolean;
  titleClassName?: string;
  imagePriority?: boolean;
}

export function PostCard({
  post,
  locale,
  showTags = false,
  titleClassName = "text-xl",
  imagePriority = false,
}: PostCardProps) {
  const isNp = locale === "np";
  const { meta } = post;
  const postHref = `/${locale}/blog/${meta.slug}`;

  const showUpdated = Boolean(
    meta.updatedAt && meta.updatedAt.split("T")[0] !== meta.date.split("T")[0]
  );
  const displayDate = showUpdated ? meta.updatedAt : meta.date;
  const datePrefix = showUpdated ? (isNp ? "अद्यावधिक: " : "Updated: ") : "";
  const formattedDate = formatDisplayDate(displayDate!, locale);

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
      <Link href={postHref} className="block group">
        <div className="relative h-44 w-full bg-muted overflow-hidden">
          {meta.image ? (
            <OptimizedImage
              src={meta.image}
              alt={meta.coverImageAlt || meta.title}
              fill
              priority={imagePriority}
              fetchPriority={imagePriority ? "high" : undefined}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900" />
          )}
        </div>
      </Link>

      <CardHeader className="flex-1 pb-4">
        <div className="flex justify-between items-center gap-2 mb-3">
          <Link href={blogCategoryUrl(locale, meta.category)}>
            <Badge
              variant="outline"
              className="text-xs font-medium hover:border-primary hover:text-primary transition-colors"
            >
              {meta.category}
            </Badge>
          </Link>
          <span className="text-xs text-muted-foreground shrink-0" title={meta.date}>
            {datePrefix}{formattedDate}
          </span>
        </div>

        <Link href={postHref} className="block group/title">
          <CardTitle
            className={`${titleClassName} group-hover/title:text-primary transition-colors line-clamp-2`}
          >
            {meta.title}
          </CardTitle>
        </Link>

        <CardDescription className="line-clamp-2 sm:line-clamp-3 mt-2">
          {meta.excerpt}
        </CardDescription>

        {showTags && meta.tags && meta.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {meta.tags.slice(0, 4).map((tag) => (
              <Link key={tag} href={blogTagUrl(locale, tag)}>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-2 py-0 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardHeader>

      <CardFooter className="pt-0 text-sm text-muted-foreground font-medium">
        {isNp ? `लेखक: ${meta.author}` : `By ${meta.author}`}
      </CardFooter>
    </Card>
  );
}
