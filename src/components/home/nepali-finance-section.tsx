import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPostsByTag } from "@/lib/posts";
import { NEPAL_MARKET_FOCUS_TAG } from "@/lib/constants";

const NEPAL_MARKET_DATA = [
  { label: "NEPSE Index", value: "2,145.32", change: "+0.58%", positive: true },
  { label: "Sensitive Index", value: "408.15", change: "+0.42%", positive: true },
  { label: "Float Index", value: "148.90", change: "-0.12%", positive: false },
  { label: "Turnover (NPR)", value: "4.2 Arba", change: "+12%", positive: true },
];

export async function NepaliFinanceSection({ locale = "en" }: { locale?: string }) {
  const isNp = locale === "np";
  const displayPosts = await getPostsByTag(locale, NEPAL_MARKET_FOCUS_TAG, 4);
  const tagQuery = encodeURIComponent(NEPAL_MARKET_FOCUS_TAG);

  return (
    <section className="py-6 md:py-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="flex-1 min-w-0 order-2 lg:order-1">
          <div className="flex items-start sm:items-center gap-3 mb-3 sm:mb-4">
            <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
              {isNp ? "नेपाल बजार विशेष" : "Nepal Market Focus"}
            </h2>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8 max-w-xl">
            {isNp
              ? "नेपाल स्टक एक्सचेन्ज (NEPSE), बैंकिङ क्षेत्रका परिवर्तनहरू, र नेपालमा तपाईंको लगानीलाई असर गर्ने म्याक्रोइकोनोमिक नीतिहरूमा नवीनतम घटनाक्रमहरूसँग अद्यावधिक रहनुहोस्।"
              : "Stay updated with the latest happenings in the Nepal Stock Exchange (NEPSE), banking sector changes, and macroeconomic policies affecting your investments in Nepal."}
          </p>

          <div className="space-y-4 sm:space-y-6">
            {displayPosts.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground">
                {isNp ? (
                  <>
                    यहाँ पोस्ट देखाउन एडमिनमा ट्याग{" "}
                    <span className="font-medium text-foreground">{NEPAL_MARKET_FOCUS_TAG}</span> थप्नुहोस्।
                  </>
                ) : (
                  <>
                    To show posts here, add the tag{" "}
                    <span className="font-medium text-foreground">{NEPAL_MARKET_FOCUS_TAG}</span> in
                    the admin editor when publishing.
                  </>
                )}
              </div>
            ) : (
              displayPosts.map((post) => (
                <article
                  key={post.meta.slug}
                  className="group flex flex-col sm:flex-row gap-3 sm:gap-4 items-start pb-4 sm:pb-6 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="relative w-full sm:w-32 h-40 sm:h-20 shrink-0 rounded-md overflow-hidden border border-border bg-muted">
                    {post.meta.image ? (
                      <Image
                        src={post.meta.image}
                        alt={post.meta.coverImageAlt || post.meta.title}
                        fill
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 640px) 100vw, 128px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 w-full">
                    <div className="flex flex-wrap gap-2 mb-1 items-center">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {post.meta.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{post.meta.date}</span>
                    </div>
                    <Link href={`/${locale}/blog/${post.meta.slug}`} className="block">
                      <h3 className="font-semibold text-base sm:text-lg leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-3 sm:line-clamp-2">
                        {post.meta.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-2">
                      {post.meta.excerpt}
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>

          {displayPosts.length > 0 && (
            <Link
              href={`/${locale}/blog?tag=${tagQuery}`}
              className="inline-flex items-center mt-5 sm:mt-6 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {isNp ? "नेपाल बजारबाट थप पढ्नुहोस्" : "Read more from Nepal Markets"}{" "}
              <ArrowRight className="w-4 h-4 ml-1 shrink-0" />
            </Link>
          )}
        </div>

        <div className="w-full lg:w-80 shrink-0 order-1 lg:order-2">
          <Card className="border-border bg-card shadow-sm lg:sticky lg:top-20">
            <CardHeader className="pb-4 border-b border-border px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg">
                {isNp ? "नेप्से स्न्यापसट" : "NEPSE Snapshot"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-0">
              <ul className="divide-y divide-border">
                {NEPAL_MARKET_DATA.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between gap-3 p-3 sm:p-4 hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium text-xs sm:text-sm text-foreground">
                      {isNp
                        ? item.label === "Turnover (NPR)"
                          ? "कारोबार (NPR)"
                          : item.label === "Sensitive Index"
                            ? "सेन्सेटिभ इन्डेक्स"
                            : item.label === "Float Index"
                              ? "फ्लोट इन्डेक्स"
                              : item.label
                        : item.label}
                    </span>
                    <div className="text-right shrink-0">
                      <div className="font-semibold text-sm tabular-nums">{item.value}</div>
                      <div
                        className={`text-xs font-semibold ${
                          item.positive
                            ? "text-emerald-900 dark:text-emerald-200"
                            : "text-red-900 dark:text-red-200"
                        }`}
                      >
                        {item.change}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-3 sm:p-4 border-t border-border">
                <Link
                  href={`/${locale}/market`}
                  className="inline-flex min-h-11 items-center justify-center text-sm font-semibold text-emerald-800 hover:text-emerald-900 dark:text-emerald-300 w-full"
                >
                  {isNp ? "पूर्ण बजार डाटा हेर्नुहोस्" : "View Full Market Data"}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
