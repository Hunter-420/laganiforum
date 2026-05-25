"use client";

import { Info } from "lucide-react";

interface DisclaimerProps {
  locale: string;
}

export function Disclaimer({ locale }: DisclaimerProps) {
  const isNp = locale === "np";

  return (
    <details className="mt-12 pt-8 border-t border-border group">
      <summary className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors list-none [&::-webkit-details-marker]:hidden">
        <Info className="w-4 h-4 shrink-0" aria-hidden />
        <span className="font-medium">
          {isNp ? "शैक्षिक सामग्री अस्वीकरण" : "Educational content notice"}
        </span>
        <span className="text-xs opacity-70 group-open:hidden">
          {isNp ? "(विस्तार गर्नुहोस्)" : "(tap to read)"}
        </span>
      </summary>
      <div className="mt-3 pl-6 text-sm text-muted-foreground leading-relaxed space-y-2 max-w-2xl">
        {isNp ? (
          <>
            <p>
              यो लेख शैक्षिक उद्देश्यका लागि मात्र हो। व्यक्तिगत वित्तीय, लगानी, वा व्यापारिक
              सल्लाह होइन।
            </p>
            <p>
              बजारमा जोखिम हुन्छ। निर्णय अघि आफैं अनुसन्धान गर्नुहोस् वा दर्ता भएका सल्लाहकारसँग
              परामर्श लिनुहोस्।
            </p>
          </>
        ) : (
          <>
            <p>
              This article is for education only — not personal financial, investment, or trading
              advice.
            </p>
            <p>
              Markets carry risk. Do your own research or speak with a licensed adviser before
              making decisions.
            </p>
          </>
        )}
      </div>
    </details>
  );
}
