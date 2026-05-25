import Link from "next/link";
import { getArticleDisclaimerText } from "@/lib/disclaimer";

interface DisclaimerProps {
  locale: string;
  customText?: string;
}

export function Disclaimer({ locale, customText }: DisclaimerProps) {
  const isNp = locale === "np";
  const body = getArticleDisclaimerText(locale, customText);

  return (
    <aside className="mt-12 pt-8 border-t border-border" aria-label={isNp ? "अस्वीकरण" : "Disclaimer"}>
      <p className="text-base lg:text-lg font-normal leading-[1.8] text-muted-foreground max-w-3xl">
        {body}
      </p>
      <p className="mt-4 text-base lg:text-lg leading-[1.8]">
        <Link
          href={`/${locale}/disclaimer`}
          className="font-semibold text-emerald-800 hover:underline dark:text-emerald-300"
        >
          {isNp ? "पूर्ण अस्वीकरण पढ्नुहोस्" : "Read full disclaimer"}
        </Link>
        .
      </p>
    </aside>
  );
}
