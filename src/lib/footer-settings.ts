import { TOPIC_CLUSTERS } from "@/lib/seo/topics";
import { STOCK_ENTITIES } from "@/lib/seo/stocks";
import type { FooterSettings } from "@/lib/types/footer";
import {
  DEFAULT_FOOTER_TAGLINE_EN,
  DEFAULT_FOOTER_TAGLINE_NP,
} from "@/lib/types/footer";

export const DEFAULT_FOOTER_SETTINGS: FooterSettings = {
  taglineEn: DEFAULT_FOOTER_TAGLINE_EN,
  taglineNp: DEFAULT_FOOTER_TAGLINE_NP,
  topicSlugs: TOPIC_CLUSTERS.map((t) => t.slug),
  stockSlugs: STOCK_ENTITIES.map((s) => s.slug),
};

export function normalizeFooterSettings(raw: unknown): FooterSettings {
  const data = raw as Partial<FooterSettings> | undefined;
  const topicSlugs = Array.isArray(data?.topicSlugs)
    ? data.topicSlugs.map(String).filter(Boolean)
    : DEFAULT_FOOTER_SETTINGS.topicSlugs;
  const stockSlugs = Array.isArray(data?.stockSlugs)
    ? data.stockSlugs.map(String).filter(Boolean)
    : DEFAULT_FOOTER_SETTINGS.stockSlugs;

  return {
    taglineEn: String(data?.taglineEn ?? DEFAULT_FOOTER_TAGLINE_EN).trim() || DEFAULT_FOOTER_TAGLINE_EN,
    taglineNp: String(data?.taglineNp ?? DEFAULT_FOOTER_TAGLINE_NP).trim() || DEFAULT_FOOTER_TAGLINE_NP,
    topicSlugs: topicSlugs.length > 0 ? topicSlugs : DEFAULT_FOOTER_SETTINGS.topicSlugs,
    stockSlugs: stockSlugs.length > 0 ? stockSlugs : DEFAULT_FOOTER_SETTINGS.stockSlugs,
  };
}

export function getFooterTopics(footer: FooterSettings) {
  return footer.topicSlugs
    .map((slug) => TOPIC_CLUSTERS.find((t) => t.slug === slug))
    .filter((t): t is (typeof TOPIC_CLUSTERS)[number] => !!t);
}

export function getFooterStocks(footer: FooterSettings) {
  return footer.stockSlugs
    .map((slug) => STOCK_ENTITIES.find((s) => s.slug === slug))
    .filter((s): s is (typeof STOCK_ENTITIES)[number] => !!s);
}
