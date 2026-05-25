import { ExternalLink, Megaphone } from "lucide-react";
import type { AffiliateBlock as AffiliateBlockType } from "@/lib/types/db";

interface AffiliateBlockProps {
  affiliate: AffiliateBlockType;
  locale?: string;
}

export function AffiliateBlock({ affiliate, locale = "en" }: AffiliateBlockProps) {
  if (!affiliate?.url || !affiliate?.title) return null;

  const isNp = locale === "np";

  return (
    <aside className="my-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b bg-muted/40 px-5 py-3">
        <Megaphone className="w-4 h-4 text-primary" aria-hidden />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {isNp ? "प्रायोजित सिफारिस" : "Sponsored recommendation"}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-5">
          {affiliate.image && (
            <div className="shrink-0 w-full sm:w-36 aspect-[4/3] rounded-xl overflow-hidden bg-muted border">
              <img
                src={affiliate.image}
                alt={affiliate.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-lg leading-snug mb-2">{affiliate.title}</h4>
            {affiliate.description && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {affiliate.description}
              </p>
            )}
            <a
              href={affiliate.url}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {affiliate.ctaText || (isNp ? "विवरण हेर्नुहोस्" : "View details")}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <p className="mt-4 pt-4 border-t text-xs text-muted-foreground leading-relaxed">
          {isNp
            ? "यो बाह्य साझेदारी लिङ्क हो। तपाईंले खरिद गर्दा हामीले कमिसन पाउन सक्छौं — तपाईंको लागतमा थप शुल्क लाग्दैन।"
            : "This is a partner link. We may earn a commission if you sign up, at no extra cost to you. Always verify terms on the provider's site."}
        </p>
      </div>
    </aside>
  );
}
