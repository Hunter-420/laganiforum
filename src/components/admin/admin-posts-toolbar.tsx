"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface AdminPostsToolbarProps {
  categories: string[];
}

export function AdminPostsToolbar({ categories }: AdminPostsToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";
  const currentTab = searchParams.get("tab") || "all";

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete(key);
    else params.set(key, value);
    router.push(`/admin?${params.toString()}`);
  };

  const tabs = [
    { id: "all", label: "All" },
    { id: "published", label: "Published" },
    { id: "drafts", label: "Drafts" },
    { id: "translation", label: "Translation drafts" },
  ] as const;

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setParam("tab", tab.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              currentTab === tab.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-muted border-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="category-filter" className="text-sm text-muted-foreground shrink-0">
          Category:
        </label>
        <select
          id="category-filter"
          value={currentCategory}
          onChange={(e) => setParam("category", e.target.value)}
          className="h-9 rounded-lg border bg-background px-3 text-sm min-w-[200px]"
        >
          <option value="all">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
