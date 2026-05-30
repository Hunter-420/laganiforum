import { Container } from "@/components/layout/container";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getSiteSettings } from "@/lib/site-settings";
import { getAuthorUrl } from "@/lib/site-url";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isNp = locale === "np";
  return buildPageMetadata({
    locale,
    title: isNp ? "हाम्रा लेखकहरू" : "Our Authors",
    description: isNp
      ? "लगानीफोरमका बजार विश्लेषक र लेखकहरू।"
      : "Meet the market analysts and writers behind Laganiforum's financial education content.",
    path: "/author",
  });
}

export default async function AuthorIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { authors } = await getSiteSettings();
  const isNp = locale === "np";

  return (
    <Container className="py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        {isNp ? "हाम्रा लेखकहरू" : "Our Authors"}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.filter(a => a.id && a.name).map(author => (
          <Link key={author.id} href={getAuthorUrl(locale, author.id)} className="block p-6 rounded-xl border border-border hover:border-primary transition-colors">
            <p className="font-bold text-lg">{author.name}</p>
            <p className="text-sm text-muted-foreground mt-1">{author.title}</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
