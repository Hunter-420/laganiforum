import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getTrustPageCopy } from "@/lib/trust-pages";
import type { Metadata } from "next";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { title, description } = getTrustPageCopy(locale, "about");
  return buildPageMetadata({ locale, title, description, path: "/about" });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { isNp, title } = getTrustPageCopy(locale, "about");
  const homeLabel = isNp ? "गृहपृष्ठ" : "Home";

  return (
    <Container className="py-8 md:py-12 max-w-3xl">
      <Breadcrumbs
        className="mb-6"
        items={[
          { label: homeLabel, href: `/${locale}` },
          { label: title },
        ]}
      />
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">{title}</h1>
      <div className="prose-spacing text-muted-foreground space-y-4 text-base leading-relaxed">
        {isNp ? (
          <>
            <p>
              <strong className="text-foreground">लगानीफोरम</strong> नेपाली र अंग्रेजीमा वित्तीय
              शिक्षा र बजार विश्लेषण प्रकाशित गर्ने शैक्षिक प्लेटफर्म हो। हाम्रो ध्यान नेप्से,
              फरेक्स, र व्यक्तिगत वित्तमा स्पष्ट, अनुसन्धान-आधारित व्याख्यामा छ।
            </p>
            <p>
              हामी व्यक्तिगत लगानी सल्लाह दिँदैनौं। लेखहरू सामान्य शिक्षा र बजार समझ बढाउन लेखिएका
              हुन्। निर्णय लिनु अघि आफैं अनुसन्धान गर्नुहोस् वा दर्ता भएका सल्लाहकारसँग
              परामर्श लिनुहोस्।
            </p>
            <p>
              सामग्री समय-समयमा अद्यावधिक गरिन्छ। प्रत्येक लेखमा लेखक जानकारी, प्रकाशन मिति, र
              जहाँ लागू हुन्छ त्यहाँ &quot;अन्तिम अद्यावधिक&quot; मिति देखाइन्छ।
            </p>
          </>
        ) : (
          <>
            <p>
              <strong className="text-foreground">Laganiforum</strong> is an educational platform
              publishing finance and market analysis in English and Nepali. We focus on clear,
              research-oriented coverage of NEPSE, forex, and personal finance topics.
            </p>
            <p>
              We do not provide personalized investment advice. Articles are written to improve
              general market literacy—not to tell you what to buy or sell. Always do your own
              research or consult a licensed adviser before making financial decisions.
            </p>
            <p>
              Content is reviewed and updated over time. Each article shows author credentials,
              publish date, and a last-updated date where applicable.
            </p>
          </>
        )}
      </div>
    </Container>
  );
}
