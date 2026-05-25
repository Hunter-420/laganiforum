import type { Metadata } from "next";
import { getSiteOrigin } from "@/lib/site-url";

export function localeAlternates(path: string) {
  const base = path.startsWith("/") ? path : `/${path}`;
  return {
    canonical: base,
    languages: {
      "en-US": `/en${base.replace(/^\/(en|np)/, "") || ""}`,
      "ne-NP": `/np${base.replace(/^\/(en|np)/, "") || ""}`,
    },
  };
}

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
  path: string;
  ogImage?: string;
}): Metadata {
  const origin = getSiteOrigin();
  const canonicalPath = `/${locale}${path}`;
  const imageUrl = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : `${origin}${ogImage}`
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${origin}${canonicalPath}`,
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
