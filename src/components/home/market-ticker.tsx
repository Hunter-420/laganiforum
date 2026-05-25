import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const mockTickerData = [
  { symbol: "NEPSE", price: "2,145.32", change: "+12.4", percent: "+0.58%", isUp: true },
  { symbol: "EUR/USD", price: "1.0842", change: "+0.0012", percent: "+0.11%", isUp: true },
  { symbol: "GOLD (oz)", price: "$2,340", change: "+5.2", percent: "+0.22%", isUp: true },
  { symbol: "USD/NPR", price: "Rs. 133.45", change: "-0.15", percent: "-0.11%", isUp: false },
];

export function MarketTicker({ locale = "en" }: { locale?: string }) {
  return (
    <div className="w-full max-w-[100vw] overflow-hidden border-b border-border bg-emerald-50/80 text-foreground dark:bg-zinc-900 dark:text-zinc-100">
      <div className="flex animate-marquee whitespace-nowrap py-2 sm:py-2.5">
        {[...mockTickerData, ...mockTickerData, ...mockTickerData].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 border-r border-border/60 dark:border-zinc-800 last:border-0"
          >
            <span className="font-semibold text-xs sm:text-sm text-foreground">
              {locale === "np" && item.symbol === "GOLD (oz)" ? "सुन (oz)" : item.symbol}
            </span>
            <span className="text-xs sm:text-sm font-medium tabular-nums">{item.price}</span>
            <span
              className={`flex items-center text-[10px] sm:text-xs font-medium tabular-nums ${
                item.isUp ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"
              }`}
            >
              {item.isUp ? (
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
              )}
              {item.change} ({item.percent})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
