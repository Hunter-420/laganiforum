import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/blog/post-card";
import { getAllPublishedPosts, postHasTag } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const revalidate = 3600;

const CATEGORIES = ["All", "NEPSE", "Forex", "Technical Analysis", "Fundamental Analysis", "Personal Finance", "Global Market"];
const NP_CATEGORIES: Record<string, string> = {
  All: "सबै",
  NEPSE: "नेप्से",
  Forex: "विदेशी मुद्रा",
  "Technical Analysis": "प्राविधिक विश्लेषण",
  "Fundamental Analysis": "मौलिक विश्लेषण",
  "Personal Finance": "व्यक्तिगत वित्त",
  "Global Market": "विश्व बजार",
};

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; tag?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { category, tag } = await searchParams;
  const isNp = locale === "np";

  const base = buildPageMetadata({
    locale,
    title: isNp ? "बजार विश्लेषण र शिक्षा" : "Market Analysis & Education",
    description: isNp
      ? "नेप्से, फरेक्स र व्यक्तिगत वित्त सम्बन्धी शैक्षिक लेखहरू।"
      : "Educational articles on NEPSE, forex, and personal finance.",
    path: "/blog",
  });

  if (category || tag) {
    return {
      ...base,
      robots: { index: false, follow: true },
    };
  }

  return base;
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; tag?: string }>;
}) {
  const { locale } = await params;
  const { category, tag } = await searchParams;
  const isNp = locale === "np";
  const homeLabel = isNp ? "गृहपृष्ठ" : "Home";
  const pageTitle = isNp ? "बजार विश्लेषण र शिक्षा" : "Market Analysis & Education";

  const allPosts = await getAllPublishedPosts(locale);
  const activeCategory = category || "All";
  const activeTag = tag?.trim();

  let filteredPosts = allPosts;

  if (activeTag) {
    filteredPosts = allPosts.filter((post) => postHasTag(post, activeTag));
  } else if (activeCategory !== "All") {
    filteredPosts = allPosts.filter(
      (post) =>
        post.meta.category.toLowerCase() === activeCategory.toLowerCase() ||
        (isNp && post.meta.category === NP_CATEGORIES[activeCategory])
    );
  }

  return (
    <Container className="py-6 md:py-8">
      <Breadcrumbs
        className="mb-6"
        items={[
          { label: homeLabel, href: `/${locale}` },
          { label: pageTitle },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {activeTag
            ? isNp
              ? `ट्याग: ${activeTag}`
              : `Tag: ${activeTag}`
            : pageTitle}
        </h1>
        <p className="text-base sm:text-xl text-muted-foreground max-w-2xl">
          {isNp
            ? "राम्रो व्यापार निर्णयहरू लिन मद्दत गर्नको लागि गहिरो अध्ययन, प्राविधिक सेटअपहरू, र बजार बुद्धिमत्ता।"
            : "Deep dives, technical setups, and market intelligence to help you make better trading decisions."}
        </p>
      </div>

      {!activeTag && (
        <div className="flex flex-wrap gap-2 mb-8 sm:mb-10">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <Link
                key={cat}
                href={`/${locale}/blog${cat === "All" ? "" : `?category=${encodeURIComponent(cat)}`}`}
              >
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className={`text-sm px-4 py-1.5 cursor-pointer transition-colors ${isActive ? "" : "hover:bg-primary/20"}`}
                >
                  {isNp ? NP_CATEGORIES[cat] || cat : cat}
                </Badge>
              </Link>
            );
          })}
        </div>
      )}

      {activeTag && (
        <Link
          href={`/${locale}/blog`}
          className="inline-block text-sm text-primary hover:underline mb-8"
        >
          {isNp ? "← सबै लेखहरू" : "← All posts"}
        </Link>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredPosts.map((post) => (
          <PostCard key={post.meta.slug} post={post} locale={locale} showTags />
        ))}
        {filteredPosts.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            {isNp ? "कुनै पनि पोस्ट फेला परेन।" : "No posts found for this language."}
          </div>
        )}
      </div>
    </Container>
  );
}
