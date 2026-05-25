import React from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PremiumContentBlocker() {
  return (
    <div className="relative py-16 px-6 rounded-2xl overflow-hidden text-center my-12 border border-border bg-card shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/80 backdrop-blur-sm z-0" />
      <div className="relative z-10 max-w-md mx-auto">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">This content is for Premium Members</h3>
        <p className="text-muted-foreground mb-6">
          Unlock full access to expert analysis, advanced chart setups, and proprietary trading signals.
        </p>
        <Button className="w-full sm:w-auto font-semibold">
          Upgrade to Premium
        </Button>
      </div>
    </div>
  );
}
