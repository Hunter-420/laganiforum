import { Container } from "@/components/layout/container";
import { MarketWidgets } from "@/components/finance/market-widgets";
import { AdPlaceholder } from "@/components/monetization/ad-placeholder";
import { TableOfContents } from "@/components/article/table-of-contents";
import { Mail } from "lucide-react";
import { NewsletterForm } from "@/components/blog/newsletter-form";

export default async function ArticleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale } = await params;
  const isNp = locale === "np";

  return (
    <Container className="py-4 md:py-6 lg:py-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <article className="flex-1 min-w-0 order-2 lg:order-1 lg:max-w-3xl">
          {children}
          <div className="mt-10">
            <AdPlaceholder format="horizontal" />
          </div>
        </article>

        <aside className="w-full lg:w-72 shrink-0 order-1 lg:order-2">
          <div className="lg:sticky lg:top-20 space-y-6">
            <TableOfContents isNp={isNp} />
            <div className="hidden lg:block">
              <MarketWidgets />
            </div>

            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Mail className="w-4 h-4" />
                <h3 className="font-semibold text-sm">
                  {isNp ? "बजार अलर्ट" : "Market alerts"}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {isNp
                  ? "साप्ताहिक नेप्से र्‍याप-अप इमेलमा पाउनुहोस्।"
                  : "Weekly NEPSE wrap-up in your inbox."}
              </p>
              <NewsletterForm locale={locale} compact />
            </div>

            <div className="hidden lg:block">
              <AdPlaceholder format="rectangle" />
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}
