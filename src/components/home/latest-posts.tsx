import Link from "next/link";
import { PostCard } from "@/components/blog/post-card";
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
        {posts.map((post, index) => (
          <PostCard key={post.meta.slug} post={post} locale={locale} showTags imagePriority={index === 0} />
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
