"use client";

import type { DailyViewPoint } from "@/lib/analytics-views";

interface ViewsChartProps {
  data: DailyViewPoint[];
  totalInRange: number;
}

export function ViewsChart({ data, totalInRange }: ViewsChartProps) {
  const max = Math.max(...data.map((d) => d.views), 1);
  const chartHeight = 200;
  const barGap = 4;

  return (
    <div className="bg-card border rounded-xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
        <div>
          <h3 className="font-semibold text-lg">Views over time</h3>
          <p className="text-sm text-muted-foreground">Daily page views — last 30 days</p>
        </div>
        <p className="text-2xl font-bold tabular-nums">
          {totalInRange.toLocaleString()}
          <span className="text-sm font-normal text-muted-foreground ml-2">total</span>
        </p>
      </div>

      {data.every((d) => d.views === 0) ? (
        <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground border border-dashed rounded-lg">
          No view data yet. Traffic will appear here after readers visit articles.
        </div>
      ) : (
        <div className="overflow-x-auto -mx-2 px-2 pb-2">
          <div
            className="flex items-end gap-1 min-w-[600px]"
            style={{ height: chartHeight }}
            role="img"
            aria-label="Bar chart of daily page views"
          >
            {data.map((point, index) => {
              const h = Math.max((point.views / max) * (chartHeight - 24), point.views > 0 ? 4 : 0);
              const showAxisLabel =
                index === 0 || index === data.length - 1 || index % 5 === 0;
              return (
                <div
                  key={point.date}
                  className="flex-1 flex flex-col items-center justify-end group min-w-0"
                  style={{ gap: barGap }}
                >
                  <span className="text-[10px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                    {point.views}
                  </span>
                  <div
                    className="w-full max-w-[28px] mx-auto rounded-t-md bg-primary/80 hover:bg-primary transition-colors"
                    style={{ height: h }}
                    title={`${point.label}: ${point.views} views`}
                  />
                  <span className="text-[9px] text-muted-foreground truncate w-full text-center mt-1 tabular-nums">
                    {showAxisLabel ? point.label : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
