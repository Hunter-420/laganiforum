import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { HubPostGrid } from "@/components/seo/hub-post-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildPersonSchema, buildBreadcrumbSchema } from "@/lib/seo/structured-data";
import { getAllPublishedPosts } from "@/lib/posts";
import { getSiteSettings, getAuthorById } from "@/lib/site-settings";
import { getSiteOrigin, getAuthorUrl } from "@/lib/site-url";
import { DEFAULT_AUTHORS } from "@/lib/types/author";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  let authors = DEFAULT_AUTHORS;
  try {
    const settings = await getSiteSettings();
    authors = settings.authors;
  } catch {
    /* build without DB */
  }

  const ids = authors.map((a) => a.id).filter(Boolean);
  return ["en", "np"].flatMap((locale) => ids.map((id) => ({ locale, id })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const settings = await getSiteSettings();
  const author = getAuthorById(settings.authors, id);
  if (!author) return {};

  const isNp = locale === "np";
  return buildPageMetadata({
    locale,
    title: isNp ? `${author.name} — लेखक` : `${author.name} — Author`,
    description:
      author.bio ||
      (isNp
        ? `${author.name} द्वारा लगानीफोरममा प्रकाशित शैक्षिक वित्तीय विश्लेषण।`
        : `Educational finance analysis by ${author.name} on Laganiforum.`),
    path: `/author/${id}`,
    ogImage: author.photoUrl,
  });
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const isNp = locale === "np";
  const settings = await getSiteSettings();
  const author = getAuthorById(settings.authors, id);

  if (!author) notFound();

  const allPosts = await getAllPublishedPosts(locale);
  const authorPosts = allPosts.filter(
    (p) => p.meta.author.trim().toLowerCase() === author.name.trim().toLowerCase()
  );

  const homeLabel = isNp ? "गृहपृष्ठ" : "Home";
  const authorUrl = getAuthorUrl(locale, author.id);
  const title = author.title || (isNp ? "बजार विश्लेषक" : "Market Analyst");

  const breadcrumbLd = buildBreadcrumbSchema([
    { name: homeLabel, url: `${getSiteOrigin()}/${locale}` },
    { name: author.name, url: authorUrl },
  ]);

  const personLd = {
    "@context": "https://schema.org",
    ...buildPersonSchema(author, locale),
  };

  return (
    <Container className="py-8 md:py-12">
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={personLd} />

      <Breadcrumbs
        className="mb-6"
        items={[
          { label: homeLabel, href: `/${locale}` },
          { label: author.name },
        ]}
      />

      <header className="mb-10 flex flex-col sm:flex-row gap-6 items-start">
        {author.photoUrl ? (
          <div className="relative h-24 w-24 shrink-0 rounded-full overflow-hidden border border-border">
            <OptimizedImage
              src={author.photoUrl}
              alt={author.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-24 w-24 shrink-0 rounded-full bg-muted flex items-center justify-center text-3xl font-bold text-primary border border-border">
            {author.name.charAt(0)}
          </div>
        )}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{author.name}</h1>
          <p className="text-primary font-medium mt-1">{title}</p>
          {author.bio && (
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">{author.bio}</p>
          )}
          {author.facebookUrl && (
            <Link
              href={author.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-primary hover:underline"
            >
              Facebook
            </Link>
          )}
        </div>
      </header>

      <section aria-labelledby="author-articles-heading">
        <h2 id="author-articles-heading" className="text-2xl font-bold mb-6">
          {isNp ? "लेखहरू" : "Articles"}
        </h2>
        <HubPostGrid
          posts={authorPosts}
          locale={locale}
          emptyMessage={isNp ? "अहिले कुनै लेख छैन।" : "No articles yet."}
        />
      </section>
    </Container>
  );
}
