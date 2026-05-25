"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { TOPIC_CLUSTERS } from "@/lib/seo/topics";
import { STOCK_ENTITIES } from "@/lib/seo/stocks";
import type { FooterSettings } from "@/lib/types/footer";

interface FooterSettingsEditorProps {
  footer: FooterSettings;
  onChange: (footer: FooterSettings) => void;
}

export function FooterSettingsEditor({ footer, onChange }: FooterSettingsEditorProps) {
  const toggleTopic = (slug: string) => {
    const has = footer.topicSlugs.includes(slug);
    onChange({
      ...footer,
      topicSlugs: has
        ? footer.topicSlugs.filter((s) => s !== slug)
        : [...footer.topicSlugs, slug],
    });
  };

  const toggleStock = (slug: string) => {
    const has = footer.stockSlugs.includes(slug);
    onChange({
      ...footer,
      stockSlugs: has
        ? footer.stockSlugs.filter((s) => s !== slug)
        : [...footer.stockSlugs, slug],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Footer</CardTitle>
        <CardDescription>
          Tagline and which topic/stock links appear in the site footer (English and Nepali pages).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Tagline (English)</label>
          <textarea
            className="mt-1 w-full min-h-[72px] rounded-lg border bg-background px-3 py-2 text-sm leading-relaxed"
            value={footer.taglineEn}
            onChange={(e) => onChange({ ...footer, taglineEn: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Tagline (Nepali)</label>
          <textarea
            className="mt-1 w-full min-h-[72px] rounded-lg border bg-background px-3 py-2 text-sm leading-relaxed font-[family-name:var(--font-mukta)]"
            value={footer.taglineNp}
            onChange={(e) => onChange({ ...footer, taglineNp: e.target.value })}
          />
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Topics (विषयहरू)</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {TOPIC_CLUSTERS.map((topic) => (
              <li key={topic.slug}>
                <label className="flex items-center gap-2 text-sm cursor-pointer rounded-lg border px-3 py-2 hover:bg-muted/50">
                  <input
                    type="checkbox"
                    checked={footer.topicSlugs.includes(topic.slug)}
                    onChange={() => toggleTopic(topic.slug)}
                    className="rounded border-input"
                  />
                  <span>
                    {topic.titleEn}
                    <span className="text-muted-foreground"> / {topic.titleNp}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Stocks (शेयर)</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {STOCK_ENTITIES.map((stock) => (
              <li key={stock.slug}>
                <label className="flex items-center gap-2 text-sm cursor-pointer rounded-lg border px-3 py-2 hover:bg-muted/50">
                  <input
                    type="checkbox"
                    checked={footer.stockSlugs.includes(stock.slug)}
                    onChange={() => toggleStock(stock.slug)}
                    className="rounded border-input"
                  />
                  <span>
                    {stock.nameEn}
                    <span className="text-muted-foreground"> / {stock.nameNp}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
