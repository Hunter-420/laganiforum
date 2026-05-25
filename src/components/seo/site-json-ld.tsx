import { JsonLd } from "@/components/seo/json-ld";
import { getSiteOrigin } from "@/lib/site-url";

interface SiteJsonLdProps {
  locale: string;
}

export function SiteJsonLd({ locale }: SiteJsonLdProps) {
  const origin = getSiteOrigin();

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Laganiforum",
    url: `${origin}/${locale}`,
    description:
      locale === "np"
        ? "नेप्से, फरेक्स र व्यक्तिगत वित्त सम्बन्धी शैक्षिक विश्लेषण।"
        : "Educational finance analysis for NEPSE, forex, and personal finance.",
    inLanguage: locale === "np" ? "ne" : "en",
    publisher: {
      "@type": "Organization",
      name: "Laganiforum",
      url: origin,
      logo: {
        "@type": "ImageObject",
        url: `${origin}/logo.svg`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${origin}/api/search?q={search_term_string}&locale=${locale}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Laganiforum",
    url: origin,
    logo: `${origin}/logo.svg`,
    sameAs: ["https://www.facebook.com/agbibas"],
  };

  return (
    <>
      <JsonLd data={website} />
      <JsonLd data={organization} />
    </>
  );
}
