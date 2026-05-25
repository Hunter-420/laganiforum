import Link from "next/link";
import { OptimizedImage } from "@/components/ui/optimized-image";
import type { AuthorProfile } from "@/lib/types/author";

interface AuthorBioProps {
  author: AuthorProfile;
  locale: string;
  fromDatabase?: boolean;
}

const FALLBACK_BIO_EN =
  "Contributing analyst at Laganiforum. Articles are written for education and general market context—not as personalized financial advice.";
const FALLBACK_BIO_NP =
  "लगानीफोरमका योगदानकर्ता विश्लेषक। लेखहरू शिक्षाका लागि मात्र हुन्—व्यक्तिगत वित्तीय सल्लाह होइनन्।";

export function AuthorBio({ author, locale, fromDatabase = false }: AuthorBioProps) {
  const isNp = locale === "np";
  const title = author.title || (isNp ? "बजार विश्लेषक" : "Market Analyst");
  const bio =
    author.bio ||
    (fromDatabase ? undefined : isNp ? FALLBACK_BIO_NP : FALLBACK_BIO_EN);
  const authorPageHref =
    author.id && author.id !== "unknown" ? `/${locale}/author/${author.id}` : null;

  return (
    <aside
      className="mt-12 rounded-2xl border border-border bg-muted/30 p-6 md:p-8"
      aria-labelledby="author-bio-heading"
    >
      <h2 id="author-bio-heading" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
        {isNp ? "लेखकको बारेमा" : "About the author"}
      </h2>
      <div className="flex flex-col sm:flex-row gap-5">
        {author.photoUrl ? (
          <div className="relative h-20 w-20 shrink-0 rounded-full overflow-hidden border border-border">
            <OptimizedImage
              src={author.photoUrl}
              alt={author.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-20 w-20 shrink-0 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-primary border border-border">
            {author.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold">
            {authorPageHref ? (
              <Link href={authorPageHref} className="hover:text-primary transition-colors">
                {author.name}
              </Link>
            ) : (
              author.name
            )}
          </p>
          <p className="text-sm text-primary font-medium mb-3">{title}</p>
          {bio && (
            <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
          )}
          {authorPageHref && (
            <Link
              href={authorPageHref}
              className="inline-block mt-2 text-sm text-primary hover:underline"
            >
              {isNp ? "लेखक पृष्ठ" : "Author profile"}
            </Link>
          )}
          {author.facebookUrl && (
            <Link
              href={author.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-primary hover:underline"
            >
              {isNp ? "फेसबुक प्रोफाइल" : "Facebook profile"}
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
