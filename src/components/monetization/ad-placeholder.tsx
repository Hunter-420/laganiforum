import React from "react";
import { cn } from "@/lib/utils";

interface AdPlaceholderProps {
  className?: string;
  format?: "horizontal" | "rectangle" | "vertical";
}

export function AdPlaceholder({ className, format = "horizontal" }: AdPlaceholderProps) {
  return (
    <div 
      className={cn(
        "bg-muted/50 border border-dashed border-border rounded-lg flex flex-col items-center justify-center p-4 text-muted-foreground",
        {
          "w-full h-[90px] md:h-[120px]": format === "horizontal",
          "w-full max-w-[300px] h-[250px] mx-auto": format === "rectangle",
          "w-[300px] h-[600px] mx-auto": format === "vertical",
        },
        className
      )}
    >
      <span className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-1">Advertisement</span>
      <span className="text-sm opacity-40 text-center">
        AdSense Slot <br/> ({format})
      </span>
    </div>
  );
}
