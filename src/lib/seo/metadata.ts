import type { Metadata } from "next";
import { getSiteOrigin } from "@/lib/site-url";

const ORIGIN = getSiteOrigin();

/**
 * Strips the leading locale segment (/en or /np) from a full locale-prefixed
 * path to return just the path segment.
 *
 * Examples:
 *   "/en/about"  → "/about"
 *   "/np/blog/my-post" → "/blog/my-post"
 *   "/en"        → ""
 */
function stripLocale(path: string): string {
  return path.replace(/^\/(en|np)/, "") || "";
}

/**
 * Builds ABSOLUTE alternate URLs for hreflang + canonical.
 *
 * `path` must be the FULL locale-prefixed path, e.g. "/en/about".
 *
 * SEO rules enforced:
 *   - Canonical is always ABSOLUTE (required by Google when metadataBase
 *     may not be available in all render contexts).
 *   - Language codes use BCP-47 short form ("en", "ne") — not "en-US" / "ne-NP"
 *     which are region-specific and less broadly matched by Google.
 *   - x-default is always set to the English canonical URL so Google knows
 *     which URL to serve to users whose language isn't matched.
 */
export function localeAlternates(path: string) {
  const segment = stripLocale(path);
  const enUrl  = `${ORIGIN}/en${segment}`;
  const neUrl  = `${ORIGIN}/np${segment}`;
  const canonicalUrl = `${ORIGIN}${path}`;

  return {
    canonical: canonicalUrl,
    languages: {
      "en": enUrl,
      "ne": neUrl,
      "x-default": enUrl,
    },
  };
}

/**
 * Central metadata builder used by every page route.
 *
 * `path` should be WITHOUT the locale prefix, e.g. "/about", "/blog", "".
 * The locale prefix is prepended internally to form the canonical URL.
 */
export function buildPageMetadata({
  locale,
  title,
  description,
  path,
  ogImage,
}: {
  locale: string;
  title: string;
  description: string;
  /** Path WITHOUT locale prefix, e.g. "/about" or "" for homepage */
  path: string;
  ogImage?: string;
}): Metadata {
  const canonicalPath = `/${locale}${path}`;
  const imageUrl = ogImage
    ? ogImage.startsWith("http") ? ogImage : `${ORIGIN}${ogImage}`
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${ORIGIN}${canonicalPath}`,
      siteName: "Laganiforum",
      locale: locale === "np" ? "ne_NP" : "en_US",
      type: "website",
      ...(imageUrl ? { images: [{ url: imageUrl, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
    // localeAlternates receives the full locale-prefixed path
    alternates: localeAlternates(canonicalPath),
  };
}

export function formatDisplayDate(isoDate: string, locale: string): string {
  try {
    return new Date(isoDate).toLocaleDateString(locale === "np" ? "ne-NP" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return isoDate;
  }
}
