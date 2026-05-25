export const DEFAULT_DISCLAIMER_EN =
  "This article is for education only — not personal financial, investment, or trading advice. Markets carry risk. Do your own research or speak with a licensed adviser before making decisions.";

export const DEFAULT_DISCLAIMER_NP =
  "यो लेख शैक्षिक उद्देश्यका लागि मात्र हो — व्यक्तिगत वित्तीय, लगानी, वा व्यापार सल्लाह होइन। बजारमा जोखिम हुन्छ। निर्णय अघि आफैं अनुसन्धान गर्नुहोस् वा दर्ता भएका सल्लाहकारसँग परामर्श लिनुहोस्।";

export function getArticleDisclaimerText(locale: string, custom?: string): string {
  const trimmed = custom?.trim();
  if (trimmed) return trimmed;
  return locale === "np" ? DEFAULT_DISCLAIMER_NP : DEFAULT_DISCLAIMER_EN;
}
