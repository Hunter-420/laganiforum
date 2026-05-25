import Link from "next/link";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getFirstParagraph } from "@/lib/author-text";
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
  const fullBio =
    author.bio ||
    (fromDatabase ? undefined : isNp ? FALLBACK_BIO_NP : FALLBACK_BIO_EN);
  const bio = fullBio ? getFirstParagraph(fullBio) : undefined;
  const authorPageHref =
    author.id && author.id !== "unknown" ? `/${locale}/author/${author.id}` : null;

  const avatar = author.photoUrl ? (
    <div className="relative h-20 w-20 shrink-0 rounded-full overflow-hidden border border-border ring-2 ring-transparent transition-shadow group-hover:ring-emerald-200 dark:group-hover:ring-emerald-800">
      <OptimizedImage
        src={author.photoUrl}
        alt={author.name}
        fill
        sizes="80px"
        className="object-cover"
      />
    </div>
  ) : (
    <div className="h-20 w-20 shrink-0 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-emerald-800 dark:text-emerald-300 border border-border">
      {author.name.charAt(0)}
    </div>
  );

  return (
    <aside
      className="mt-12 rounded-2xl border border-border bg-muted/30 p-6 md:p-8"
      aria-labelledby="author-bio-heading"
    >
      <h2
        id="author-bio-heading"
        className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4"
      >
        {isNp ? "लेखकको बारेमा" : "About the author"}
      </h2>
      <div className="flex flex-col sm:flex-row gap-5">
        {authorPageHref ? (
          <Link href={authorPageHref} className="shrink-0 group" aria-label={`${author.name} — ${isNp ? "लेखक पृष्ठ" : "author profile"}`}>
            {avatar}
          </Link>
        ) : (
          avatar
        )}
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold">
            {authorPageHref ? (
              <Link
                href={authorPageHref}
                className="hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
              >
                {author.name}
              </Link>
            ) : (
              author.name
            )}
          </p>
          <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium mb-3">{title}</p>
          {bio &&
            (authorPageHref ? (
              <Link
                href={authorPageHref}
                className="block text-base lg:text-lg font-normal leading-[1.8] text-muted-foreground hover:text-foreground transition-colors"
              >
                {bio}
              </Link>
            ) : (
              <p className="text-base lg:text-lg font-normal leading-[1.8] text-muted-foreground">{bio}</p>
            ))}
        </div>
      </div>
    </aside>
  );
}
