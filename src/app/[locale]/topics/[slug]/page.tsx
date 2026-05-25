import { redirectToLocaleHome } from "@/lib/navigation";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { HubPostGrid } from "@/components/seo/hub-post-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildItemListSchema } from "@/lib/seo/structured-data";
import { filterPostsByTopic } from "@/lib/seo/filter-posts";
import { TOPIC_CLUSTERS, getTopicBySlug } from "@/lib/seo/topics";
import { getAllPublishedPosts } from "@/lib/posts";
import { getSiteOrigin, getTopicUrl } from "@/lib/site-url";
import type { Metadata } from "next";

export const revalidate = 3600;

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of ["en", "np"]) {
    for (const topic of TOPIC_CLUSTERS) {
      params.push({ locale, slug: topic.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return {};

  const isNp = locale === "np";
  return buildPageMetadata({
    locale,
    title: isNp ? topic.titleNp : topic.titleEn,
    description: isNp ? topic.descriptionNp : topic.descriptionEn,
    path: `/topics/${slug}`,
  });
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) redirectToLocaleHome(locale);

  const isNp = locale === "np";
  const title = isNp ? topic.titleNp : topic.titleEn;
  const description = isNp ? topic.descriptionNp : topic.descriptionEn;
  const homeLabel = isNp ? "गृहपृष्ठ" : "Home";
  const analysisLabel = isNp ? "बजार विश्लेषण" : "Analysis";

  const allPosts = await getAllPublishedPosts(locale);
  const posts = filterPostsByTopic(allPosts, topic);
  const topicUrl = getTopicUrl(locale, slug);

  const breadcrumbLd = buildBreadcrumbSchema([
    { name: homeLabel, url: `${getSiteOrigin()}/${locale}` },
    { name: analysisLabel, url: `${getSiteOrigin()}/${locale}/blog` },
    { name: title, url: topicUrl },
  ]);

  const itemListLd = buildItemListSchema(
    title,
    posts.slice(0, 12).map((p) => ({
      name: p.meta.title,
      url: `${getSiteOrigin()}/${locale}/blog/${p.meta.slug}`,
    }))
  );

  return (
    <Container className="py-8 md:py-12">
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={itemListLd} />

      <Breadcrumbs
        className="mb-6"
        items={[
          { label: homeLabel, href: `/${locale}` },
          { label: analysisLabel, href: `/${locale}/blog` },
          { label: title },
        ]}
      />

      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{title}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">{description}</p>
      </header>

      <section aria-labelledby="topic-posts-heading">
        <h2 id="topic-posts-heading" className="sr-only">
          {isNp ? "सम्बन्धित लेखहरू" : "Related posts"}
        </h2>
        <HubPostGrid
          posts={posts}
          locale={locale}
          emptyMessage={isNp ? "यस विषयमा अहिले कुनै लेख छैन।" : "No articles in this topic yet."}
        />
      </section>
    </Container>
  );
}
