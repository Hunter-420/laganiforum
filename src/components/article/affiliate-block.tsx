import Image from "next/image";
import { ArrowUpRight, Megaphone, Sparkles } from "lucide-react";
import type { AffiliateBlock as AffiliateBlockType } from "@/lib/types/db";

interface AffiliateBlockProps {
  affiliate: AffiliateBlockType;
  locale?: string;
}

export function AffiliateBlock({ affiliate, locale = "en" }: AffiliateBlockProps) {
  if (!affiliate?.url || !affiliate?.title) return null;

  const isNp = locale === "np";
  const cta = affiliate.ctaText || (isNp ? "विवरण हेर्नुहोस्" : "View offer");

  return (
    <aside className="my-10">
      <a
        href={affiliate.url}
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        className="group block overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-md hover:shadow-xl hover:border-primary/40 transition-all duration-300"
      >
        <div className="flex items-center justify-between gap-2 border-b border-primary/10 bg-primary/5 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15">
              <Megaphone className="w-3.5 h-3.5 text-primary" aria-hidden />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {isNp ? "प्रायोजित" : "Sponsored"}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-primary/60" aria-hidden />
          </div>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {affiliate.image && (
              <div className="relative shrink-0 w-full sm:w-40 aspect-[4/3] rounded-xl overflow-hidden bg-muted border shadow-inner ring-1 ring-black/5">
                <Image
                  src={affiliate.image}
                  alt={affiliate.description ? `${affiliate.title} — sponsor` : affiliate.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 160px"
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-xl leading-snug mb-2 group-hover:text-primary transition-colors">
                {affiliate.title}
              </h4>
              {affiliate.description && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                  {affiliate.description}
                </p>
              )}
              <span className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm group-hover:bg-primary/90 transition-colors">
                {cta}
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          <p className="mt-4 pt-4 border-t border-border/60 text-xs text-muted-foreground leading-relaxed">
            {isNp
              ? "यो बाह्य साझेदारी लिङ्क हो। खरिद गर्दा हामीले कमिसन पाउन सक्छौं — तपाईंको लागतमा थप शुल्क लाग्दैन।"
              : "Partner link. We can earn a commission if you sign up, at no extra cost to you. Verify terms on the provider's site."}
          </p>
        </div>
      </a>
    </aside>
  );
}
