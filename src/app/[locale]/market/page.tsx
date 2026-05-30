import React from "react";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { TradingViewWidget } from "@/components/finance/trading-view-widget";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isNp = locale === "np";
  return buildPageMetadata({
    locale,
    title: isNp ? "लाइभ बजार चार्ट" : "Live Market Charts",
    description: isNp
      ? "वास्तविक समयमा फरेक्स र विश्व बजार डेटा हेर्नुहोस्।"
      : "Track real-time forex and global market data.",
    path: "/market",
  });
}

export default async function MarketPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isNp = locale === "np";
  const homeLabel = isNp ? "गृहपृष्ठ" : "Home";
  const pageTitle = isNp ? "लाइभ बजार चार्ट" : "Live Market Charts";

  return (
    <Container className="py-12">
      <Breadcrumbs
        className="mb-6"
        items={[
          { label: homeLabel, href: `/${locale}` },
          { label: pageTitle },
        ]}
      />

      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{pageTitle}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          {isNp
            ? "वास्तविक समय डेटा, प्रवृत्ति विश्लेषण, र अर्को व्यापार सेटअप पहिचान गर्नुहोस्।"
            : "Track real-time data, analyze trends, and identify your next trading setup across global markets."}
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <div className="prose-spacing mb-8 max-w-3xl text-foreground/80 leading-relaxed">
            {isNp ? (
              <>
                <p>
                  विदेशी मुद्रा (Forex) बजार विश्वको सबैभन्दा ठूलो र सबैभन्दा तरल वित्तीय बजार हो। 
                  यस खण्डमा तपाईंले EUR/USD, GBP/USD र अन्य प्रमुख मुद्राहरूको वास्तविक-समय चार्टहरू 
                  विश्लेषण गर्न सक्नुहुन्छ।
                </p>
                <p>
                  <strong>कसरी प्रयोग गर्ने:</strong> चार्टमा उपलब्ध प्राविधिक उपकरणहरू (Indicators) 
                  प्रयोग गरेर ट्रेन्ड लाइनहरू कोर्नुहोस् र समर्थन/प्रतिरोध (Support/Resistance) स्तरहरू 
                  पहिचान गर्नुहोस्।
                </p>
              </>
            ) : (
              <>
                <p>
                  The Foreign Exchange (Forex) market is the largest and most liquid financial market 
                  globally. In this section, you can analyze real-time charts for major currency pairs 
                  including EUR/USD, GBP/USD, and others.
                </p>
                <p>
                  <strong>How to use this chart:</strong> Utilize the built-in technical indicators 
                  and drawing tools to map out trend lines, identify key support and resistance levels, 
                  and plan your next trade setup with precision.
                </p>
              </>
            )}
          </div>
          
          <h2 className="text-2xl font-bold mb-6">
            {isNp ? "विश्व फरेक्स (EUR/USD)" : "Global Forex (EUR/USD)"}
          </h2>
          <TradingViewWidget symbol="FX:EURUSD" />
        </section>
      </div>
    </Container>
  );
}
