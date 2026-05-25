import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

export function MarketWidgets() {
  const MOCK_WIDGET_DATA = [
    { label: "NEPSE", value: "2,145.32", change: "+12.4", isUp: true },
    { label: "EUR/USD", value: "1.0842", change: "+0.11%", isUp: true },
    { label: "GOLD", value: "$2,340", change: "+0.22%", isUp: true },
    { label: "USD/NPR", value: "Rs. 133.45", change: "-0.11%", isUp: false },
  ];

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-4 border-b border-border bg-muted/20">
        <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
          <TrendingUp className="w-4 h-4 text-primary" />
          Live Markets
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {MOCK_WIDGET_DATA.map((item, idx) => (
            <li key={idx} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
              <span className="font-semibold text-sm">{item.label}</span>
              <div className="flex items-center gap-3">
                <span className="font-medium text-sm">{item.value}</span>
                <span className={`flex items-center text-xs font-bold w-16 justify-end ${item.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                  {item.isUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                  {item.change}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
