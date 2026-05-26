import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface RiskBannerProps {
  locale: string;
  customText?: string;
}

export function RiskBanner({ locale, customText }: RiskBannerProps) {
  const isNp = locale === "np";

  return (
    <div
      role="note"
      className="mb-8 flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-foreground"
    >
      <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" aria-hidden />
      <p className="leading-relaxed">
        {isNp ? (
          <>
            <strong className="font-semibold">शैक्षिक सामग्री:</strong>{" "}
            {customText || "यो लेख लगानी वा व्यापार सल्लाह होइन। निर्णय अघि आफैं अनुसन्धान गर्नुहोस्।"}{" "}
            <Link
              href={`/${locale}/disclaimer`}
              className="font-semibold text-emerald-800 hover:underline dark:text-emerald-300 whitespace-nowrap"
            >
              पूर्ण अस्वीकरण पढ्नुहोस्
            </Link>
            ।
          </>
        ) : (
          <>
            <strong className="font-semibold">Educational content:</strong>{" "}
            {customText || "This article is not investment or trading advice. Do your own research before acting."}{" "}
            <Link
              href={`/${locale}/disclaimer`}
              className="font-semibold text-emerald-800 hover:underline dark:text-emerald-300 whitespace-nowrap"
            >
              Read full disclaimer
            </Link>
            .
          </>
        )}
      </p>
    </div>
  );
}
