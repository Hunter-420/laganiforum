import Link from "next/link";
import { Container } from "@/components/layout/container";
import { TOPIC_CLUSTERS } from "@/lib/seo/topics";
import { STOCK_ENTITIES } from "@/lib/seo/stocks";

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const isNp = locale === "np";
  const year = new Date().getFullYear();

  const analysisLabel = isNp ? "बजार विश्लेषण" : "Analysis";
  const marketsLabel = isNp ? "लाइभ बजार" : "Markets";
  const aboutLabel = isNp ? "हाम्रो बारेमा" : "About";
  const contactLabel = isNp ? "सम्पर्क" : "Contact";
  const disclaimerLabel = isNp ? "अस्वीकरण" : "Disclaimer";

  return (
    <footer className="mt-auto border-t border-border bg-muted/60">
      <Container className="py-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="font-bold text-lg text-emerald-800 dark:text-emerald-300">
              Laganiforum
            </Link>
            <p className="mt-3 text-base text-foreground/80 leading-relaxed max-w-md">
              {isNp
                ? "नेप्से, फरेक्स र व्यक्तिगत वित्त सम्बन्धी शैक्षिक विश्लेषण। यो साइट लगानी सल्लाह होइन—आफैं अनुसन्धान गर्नुहोस्।"
                : "Educational analysis on NEPSE, forex, and personal finance. This site is not investment advice—always do your own research."}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              {isNp ? "साइट" : "Site"}
            </h3>
            <ul className="space-y-2 text-base text-foreground/80">
              <li>
                <Link href={`/${locale}/blog`} className="font-semibold text-emerald-800 hover:text-emerald-900 dark:text-emerald-300 transition-colors">
                  {analysisLabel}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/market`} className="font-semibold text-emerald-800 hover:text-emerald-900 dark:text-emerald-300 transition-colors">
                  {marketsLabel}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              {isNp ? "कानूनी र विश्वास" : "Legal & trust"}
            </h3>
            <ul className="space-y-2 text-base text-foreground/80">
              <li>
                <Link href={`/${locale}/about`} className="font-semibold text-emerald-800 hover:text-emerald-900 dark:text-emerald-300 transition-colors">
                  {aboutLabel}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="font-semibold text-emerald-800 hover:text-emerald-900 dark:text-emerald-300 transition-colors">
                  {contactLabel}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/disclaimer`} className="font-semibold text-emerald-800 hover:text-emerald-900 dark:text-emerald-300 transition-colors">
                  {disclaimerLabel}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <nav
          className="mt-8 pt-6 border-t border-border text-xs text-muted-foreground"
          aria-label={isNp ? "विषय र शेयर" : "Topics and stocks"}
        >
          <p className="font-medium text-foreground/80 mb-2">
            {isNp ? "विषयहरू" : "Topics"}
          </p>
          <ul className="flex flex-wrap gap-x-2 gap-y-2 mb-4">
            {TOPIC_CLUSTERS.map((topic) => (
              <li key={topic.slug}>
                <Link
                  href={`/${locale}/topics/${topic.slug}`}
                  className="inline-flex min-h-11 min-w-11 items-center px-2 py-2 text-sm font-semibold text-emerald-900 hover:text-emerald-950 dark:text-emerald-200 rounded-md"
                >
                  {isNp ? topic.titleNp : topic.titleEn}
                </Link>
              </li>
            ))}
          </ul>
          <p className="font-medium text-foreground/80 mb-2">
            {isNp ? "शेयर" : "Stocks"}
          </p>
          <ul className="flex flex-wrap gap-x-2 gap-y-2">
            {STOCK_ENTITIES.map((stock) => (
              <li key={stock.slug}>
                <Link
                  href={`/${locale}/stocks/${stock.slug}`}
                  className="inline-flex min-h-11 min-w-11 items-center px-2 py-2 text-sm font-semibold text-emerald-900 hover:text-emerald-950 dark:text-emerald-200 rounded-md"
                >
                  {isNp ? stock.nameNp : stock.nameEn}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 pt-6 border-t border-border flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
          <p>
            © {year} Laganiforum. {isNp ? "सर्वाधिकार सुरक्षित।" : "All rights reserved."}
          </p>
          <p>
            {isNp ? "सामग्री शैक्षिक उद्देश्यका लागि मात्र।" : "Content is for educational purposes only."}
            {" "}
            <Link href={`/${locale}/disclaimer`} className="font-semibold underline text-emerald-800 hover:text-emerald-900 dark:text-emerald-300">
              {disclaimerLabel}
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
