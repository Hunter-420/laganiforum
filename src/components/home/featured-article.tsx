import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getFeaturedPost } from "@/lib/posts";

export async function FeaturedArticle({ locale = "en" }: { locale?: string }) {
  const isNp = locale === "np";
  const featuredPost = await getFeaturedPost(locale);

  if (!featuredPost) {
    return (
      <div className="rounded-2xl bg-card border h-64 flex items-center justify-center text-muted-foreground">
        {isNp ? "कुनै पनि विशेष लेख फेला परेन।" : "No featured article found."}
      </div>
    );
  }

  const { meta } = featuredPost;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card border shadow-sm transition-all hover:shadow-md">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="relative h-52 sm:h-64 md:h-full min-h-[220px] md:min-h-[300px] w-full bg-muted overflow-hidden">
          {meta.image ? (
            <Image
              src={meta.image}
              alt={meta.coverImageAlt || meta.title}
              fill
              priority
              fetchPriority="high"
              loading="eager"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-600 transition-transform duration-500 group-hover:scale-105" />
          )}
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="flex flex-col justify-center p-8 lg:p-12">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
              {meta.category}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">{meta.date}</span>
          </div>
          <Link href={`/${locale}/blog/${meta.slug}`}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-3 sm:mb-4 group-hover:text-primary transition-colors line-clamp-3">
              {meta.title}
            </h2>
          </Link>
          <p className="text-muted-foreground mb-6 line-clamp-3">{meta.excerpt}</p>
          <div className="flex items-center gap-3 mt-auto">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-primary">
              {meta.author.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold">{meta.author}</p>
              <p className="text-xs text-muted-foreground">
                {isNp ? "बजार विश्लेषक" : "Market Analyst"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
