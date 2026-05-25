"use client";

import dynamic from "next/dynamic";

const TradingViewClient = dynamic(
  () => import("./trading-view-client").then((mod) => mod.TradingViewClient),
  { ssr: false, loading: () => <div className="h-[500px] w-full rounded-xl bg-muted animate-pulse flex items-center justify-center text-muted-foreground border border-border shadow-sm">Loading Chart...</div> }
);

export function TradingViewWidget({ symbol = "FX:EURUSD" }: { symbol?: string }) {
  return <TradingViewClient symbol={symbol} />;
}
