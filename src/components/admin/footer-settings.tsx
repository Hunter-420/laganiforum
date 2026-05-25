"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { TOPIC_CLUSTERS } from "@/lib/seo/topics";
import { STOCK_ENTITIES } from "@/lib/seo/stocks";
import type { FooterSettings } from "@/lib/types/footer";

interface FooterSettingsEditorProps {
  footer: FooterSettings;
  onChange: (footer: FooterSettings) => void;
}

export function FooterSettingsEditor({ footer, onChange }: FooterSettingsEditorProps) {
  const [topicInput, setTopicInput] = useState(footer.topicSlugs.join(", "));
  const [stockInput, setStockInput] = useState(footer.stockSlugs.join(", "));

  useEffect(() => {
    setTopicInput(footer.topicSlugs.join(", "));
  }, [footer.topicSlugs]);

  useEffect(() => {
    setStockInput(footer.stockSlugs.join(", "));
  }, [footer.stockSlugs]);

  const handleTopicBlur = () => {
    const slugs = topicInput.split(",").map((s) => s.trim()).filter(Boolean);
    onChange({ ...footer, topicSlugs: slugs });
  };

  const handleStockBlur = () => {
    const slugs = stockInput.split(",").map((s) => s.trim()).filter(Boolean);
    onChange({ ...footer, stockSlugs: slugs });
  };

  const toggleTopic = (slug: string) => {
    const current = topicInput.split(",").map((s) => s.trim()).filter(Boolean);
    let newSlugs;
    if (current.includes(slug)) {
      newSlugs = current.filter((s) => s !== slug);
    } else {
      newSlugs = [...current, slug];
    }
    onChange({ ...footer, topicSlugs: newSlugs });
  };

  const toggleStock = (slug: string) => {
    const current = stockInput.split(",").map((s) => s.trim()).filter(Boolean);
    let newSlugs;
    if (current.includes(slug)) {
      newSlugs = current.filter((s) => s !== slug);
    } else {
      newSlugs = [...current, slug];
    }
    onChange({ ...footer, stockSlugs: newSlugs });
  };

  const inputClass = "w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

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
          <label className="text-sm font-medium mb-2 block">Topics (विषयहरू)</label>
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            onBlur={handleTopicBlur}
            onKeyDown={(e) => e.key === "Enter" && handleTopicBlur()}
            placeholder="Comma separated topic slugs..."
            className={inputClass}
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {TOPIC_CLUSTERS.map((topic) => {
              const isActive = footer.topicSlugs.includes(topic.slug);
              return (
                <button
                  key={topic.slug}
                  type="button"
                  className={`text-xs px-2 py-0.5 rounded-md border ${isActive ? "bg-primary/10 border-primary/20 text-primary" : "hover:bg-muted"}`}
                  onClick={() => toggleTopic(topic.slug)}
                >
                  {isActive ? "-" : "+"} {topic.titleEn}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Stocks (शेयर)</label>
          <input
            type="text"
            value={stockInput}
            onChange={(e) => setStockInput(e.target.value)}
            onBlur={handleStockBlur}
            onKeyDown={(e) => e.key === "Enter" && handleStockBlur()}
            placeholder="Comma separated stock slugs..."
            className={inputClass}
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {STOCK_ENTITIES.map((stock) => {
              const isActive = footer.stockSlugs.includes(stock.slug);
              return (
                <button
                  key={stock.slug}
                  type="button"
                  className={`text-xs px-2 py-0.5 rounded-md border ${isActive ? "bg-primary/10 border-primary/20 text-primary" : "hover:bg-muted"}`}
                  onClick={() => toggleStock(stock.slug)}
                >
                  {isActive ? "-" : "+"} {stock.nameEn}
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
