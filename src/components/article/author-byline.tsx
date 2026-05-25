import Link from "next/link";
import { OptimizedImage } from "@/components/ui/optimized-image";
import type { AuthorProfile } from "@/lib/types/author";

interface AuthorBylineProps {
  author: AuthorProfile;
  locale: string;
}

export function AuthorByline({ author, locale }: AuthorBylineProps) {
  const isNp = locale === "np";
  const title = author.title || (isNp ? "बजार विश्लेषक" : "Market Analyst");

  return (
    <div className="flex items-center gap-4 min-w-0">
      {author.photoUrl ? (
        <div className="relative h-11 w-11 shrink-0 rounded-full overflow-hidden border border-border">
          <OptimizedImage
            src={author.photoUrl}
            alt={author.name}
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-11 w-11 shrink-0 rounded-full bg-muted flex items-center justify-center font-semibold text-primary border border-border">
          {author.name.charAt(0)}
        </div>
      )}
      <div className="min-w-0">
        <p className="font-semibold truncate">
          {author.id && author.id !== "unknown" ? (
            <Link href={`/${locale}/author/${author.id}`} className="hover:text-primary transition-colors">
              {author.name}
            </Link>
          ) : (
            author.name
          )}
        </p>
        <p className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span>{title}</span>
          {author.facebookUrl && (
            <Link
              href={author.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-xs"
            >
              Facebook
            </Link>
          )}
        </p>
      </div>
    </div>
  );
}
