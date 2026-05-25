"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchResult {
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  date: string;
  href: string;
}

export function SearchDialog({
  locale,
  open: controlledOpen,
  onOpenChange,
}: {
  locale: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const isNp = locale === "np";

  const runSearch = useCallback(
    async (q: string) => {
      if (q.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q)}&locale=${locale}`
        );
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [locale]
  );

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => runSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query, open, runSearch]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="hidden sm:flex hover:bg-muted"
        title={isNp ? "खोज (Ctrl+K)" : "Search (Ctrl+K)"}
        onClick={() => setOpen(true)}
        type="button"
      >
        <Search className="w-4 h-4" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-[90] flex items-start justify-center pt-[12vh] px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-xl border bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 border-b px-4">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isNp ? "लेख, श्रेणी वा ट्याग खोज्नुहोस्..." : "Search articles, categories, tags..."
                }
                className="flex-1 h-12 bg-transparent text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded-md hover:bg-muted text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isNp ? "खोज्दै..." : "Searching..."}
                </div>
              )}
              {!loading && query.length >= 2 && results.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  {isNp ? "कुनै परिणाम फेला परेन।" : "No results found."}
                </p>
              )}
              {!loading && query.length < 2 && (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  {isNp ? "कम्तीमा २ अक्षर टाइप गर्नुहोस्" : "Type at least 2 characters"}
                </p>
              )}
              {results.map((r) => (
                <button
                  key={r.slug}
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-muted/60 border-b last:border-0 transition-colors"
                  onClick={() => {
                    setOpen(false);
                    router.push(r.href);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{r.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {r.category} · {r.date}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
