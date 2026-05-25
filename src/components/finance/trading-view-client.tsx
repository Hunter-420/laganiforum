"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    TradingView?: {
      widget: new (config: Record<string, unknown>) => { remove: () => void };
    };
  }
}

const TV_SCRIPT_ID = "tradingview-widget-script";
const TV_SCRIPT_SRC = "https://s3.tradingview.com/tv.js";

function loadTradingViewScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.TradingView) return Promise.resolve();

  const existing = document.getElementById(TV_SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve) => {
      if (window.TradingView) resolve();
      else existing.addEventListener("load", () => resolve(), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = TV_SCRIPT_ID;
    script.src = TV_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("TradingView script failed to load"));
    document.body.appendChild(script);
  });
}

export function TradingViewClient({ symbol }: { symbol: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<{ remove: () => void } | null>(null);
  const [ready, setReady] = useState(false);
  const [containerId] = useState(
    () => `tv_${symbol.replace(/[^a-zA-Z0-9]/g, "")}_${Math.random().toString(36).slice(2, 9)}`
  );

  useEffect(() => {
    let cancelled = false;

    loadTradingViewScript()
      .then(() => {
        if (cancelled || !containerRef.current || widgetRef.current) return;
        if (!window.TradingView) return;

        widgetRef.current = new window.TradingView.widget({
          autosize: true,
          symbol,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          backgroundColor: "rgba(9, 9, 11, 1)",
          gridColor: "rgba(39, 39, 42, 0.4)",
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: containerId,
        });
        setReady(true);
      })
      .catch(console.error);

    return () => {
      cancelled = true;
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
        } catch {
          /* ignore */
        }
        widgetRef.current = null;
      }
    };
  }, [symbol, containerId]);

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden border border-border shadow-sm bg-muted">
      {!ready && (
        <div className="h-full w-full animate-pulse bg-muted flex items-center justify-center text-sm text-muted-foreground">
          Loading chart…
        </div>
      )}
      <div
        id={containerId}
        ref={containerRef}
        className={`h-full w-full ${ready ? "" : "hidden"}`}
      />
    </div>
  );
}
