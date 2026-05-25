"use client";

import { useEffect, useRef } from "react";

export function ViewTracker({ slug, locale }: { slug: string; locale: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    
    // Only track once per page load to prevent double-counting on strict mode / re-renders
    tracked.current = true;
    
    fetch("/api/analytics/view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug, locale }),
    }).catch((err) => {
      console.error("Failed to track view:", err);
    });
  }, [slug, locale]);

  return null;
}
