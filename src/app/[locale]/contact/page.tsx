import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getTrustPageCopy } from "@/lib/trust-pages";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { title, description } = getTrustPageCopy(locale, "contact");
  return buildPageMetadata({ locale, title, description, path: "/contact" });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { isNp, title } = getTrustPageCopy(locale, "contact");
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
      <div className="text-muted-foreground space-y-4 text-base leading-relaxed">
        {isNp ? (
          <>
            <p>
              सामग्री सम्बन्धी प्रश्न, सुधार, वा सामान्य सम्पर्कका लागि हामीलाई फेसबुक मार्फत
              सम्पर्क गर्न सक्नुहुन्छ।
            </p>
            <p>
              <Link
                href="https://www.facebook.com/agbibas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline"
              >
                facebook.com/agbibas
              </Link>
            </p>
            <p className="text-sm">
              हामी व्यक्तिगत पोर्टफोलियो वा व्यापार सिफारिसहरू प्रदान गर्दैनौं। कृपया{" "}
              <Link href={`/${locale}/disclaimer`} className="text-primary hover:underline">
                अस्वीकरण
              </Link>{" "}
              पढ्नुहोस्।
            </p>
          </>
        ) : (
          <>
            <p>
              For editorial questions, corrections, or general inquiries, reach us on Facebook.
            </p>
            <p>
              <Link
                href="https://www.facebook.com/agbibas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline"
              >
                facebook.com/agbibas
              </Link>
            </p>
            <p className="text-sm">
              We do not provide personalized portfolio or trade recommendations. Please read our{" "}
              <Link href={`/${locale}/disclaimer`} className="text-primary hover:underline">
                disclaimer
              </Link>
              .
            </p>
          </>
        )}
      </div>
    </Container>
  );
}
