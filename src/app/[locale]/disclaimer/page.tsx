import Link from "next/link";
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
  const { title, description } = getTrustPageCopy(locale, "disclaimer");
  return buildPageMetadata({ locale, title, description, path: "/disclaimer" });
}

export default async function DisclaimerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { isNp, title } = getTrustPageCopy(locale, "disclaimer");
  const homeLabel = isNp ? "गृहपृष्ठ" : "Home";

  const sections = isNp
    ? [
        {
          heading: "शैक्षिक उद्देश्य मात्र",
          body: "लगानीफोरममा प्रकाशित सबै सामग्री शैक्षिक उद्देश्यका लागि मात्र हो। यो व्यक्तिगत वित्तीय, लगानी, कर, वा व्यापारिक सल्लाह होइन।",
        },
        {
          heading: "जोखिम प्रकटीकरण",
          body: "शेयर, विदेशी मुद्रा, र अन्य वित्तीय बजारमा महत्वपूर्ण जोखिम हुन्छ। तपाईंले गुमाउन सक्ने रकमभन्दा बढी जोखिम लिनु हुँदैन। विगतको प्रदर्शन भविष्यको नतिजा ग्यारेन्टी गर्दैन।",
        },
        {
          heading: "स्वतन्त्र निर्णय",
          body: "कुनै पनि लेख, चार्ट, वा उपकरणले तपाईंलाई कुनै निश्चित कार्य गर्न बाध्य पार्दैन। निर्णय अघि आफैं अनुसन्धान गर्नुहोस् वा दर्ता भएका वित्तीय सल्लाहकारसँग परामर्श लिनुहोस्।",
        },
        {
          heading: "सहबद्ध लिंक र विज्ञापन",
          body: "केही लेखहरूमा सहबद्ध वा प्रायोजित सिफारिसहरू हुन सक्छन्। तिनीहरू स्पष्ट रूपमा चिनाइन्छन् र हाम्रो सम्पादकीय राय परिवर्तन गर्दैनन्।",
        },
        {
          heading: "सामग्री अद्यावधिक",
          body: "बजार अवस्था परिवर्तन हुन्छ। लेखहरू समय-समयमा अद्यावधिक गरिन्छ; प्रत्येक लेखमा प्रकाशन र अन्तिम अद्यावधिक मिति हेर्नुहोस्।",
        },
      ]
    : [
        {
          heading: "Educational purpose only",
          body: "All content on Laganiforum is published for education only. It is not personal financial, investment, tax, or trading advice.",
        },
        {
          heading: "Risk disclosure",
          body: "Stocks, forex, and other financial markets carry substantial risk. You should not risk more than you can afford to lose. Past performance does not guarantee future results.",
        },
        {
          heading: "Independent decisions",
          body: "No article, chart, or tool on this site obligates you to take any action. Do your own research or speak with a licensed financial adviser before making decisions.",
        },
        {
          heading: "Affiliate links & advertising",
          body: "Some posts may include affiliate or sponsored recommendations. These are clearly labeled and do not change our editorial standards.",
        },
        {
          heading: "Content updates",
          body: "Markets change. Articles are updated over time—check the published and last-updated dates on each post.",
        },
      ];

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
      <div className="space-y-8 text-muted-foreground">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold text-foreground mb-2">{section.heading}</h2>
            <p className="leading-relaxed">{section.body}</p>
          </section>
        ))}
      </div>
      <p className="mt-10 text-sm">
        <Link href={`/${locale}/about`} className="text-primary hover:underline">
          {isNp ? "हाम्रो बारेमा" : "About us"}
        </Link>
        {" · "}
        <Link href={`/${locale}/contact`} className="text-primary hover:underline">
          {isNp ? "सम्पर्क" : "Contact"}
        </Link>
      </p>
    </Container>
  );
}
