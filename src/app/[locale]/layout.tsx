import type { Metadata } from "next";
import { Geist, Geist_Mono, Mukta } from "next/font/google";
import { DialogProvider } from "@/components/ui/dialog";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SiteJsonLd } from "@/components/seo/site-json-ld";
import { getSiteOrigin } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const mukta = Mukta({
  variable: "--font-mukta",
  weight: ["400", "500", "600", "700"],
  subsets: ["devanagari", "latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: false,
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isNp = locale === "np";
  return {
    title: {
      template: "%s | Laganiforum",
      default: isNp ? "लगानीफोरम | वित्तीय ज्ञान" : "Laganiforum | Finance & Trading",
    },
    description: isNp
      ? "लगानीफोरम - नेप्से, फरेक्स र व्यक्तिगत वित्त सम्बन्धी शैक्षिक विश्लेषण।"
      : "Laganiforum - NEPSE, forex, and personal finance education in English and Nepali.",
    metadataBase: new URL(getSiteOrigin()),
    openGraph: {
      siteName: "Laganiforum",
      locale: isNp ? "ne_NP" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
    alternates: {
      languages: {
        "en-US": "/en",
        "ne-NP": "/np",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const isNp = locale === "np";

  return (
    <div
      lang={isNp ? "ne" : locale}
      className={`${geistSans.variable} ${geistMono.variable} ${mukta.variable} min-h-dvh flex flex-col ${isNp ? "np-locale font-mukta" : "font-sans"}`}
    >
      <SiteJsonLd locale={locale} />
      <DialogProvider>
        <Navbar locale={locale} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} />
      </DialogProvider>
    </div>
  );
}
