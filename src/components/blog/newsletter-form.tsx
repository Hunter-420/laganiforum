"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NewsletterFormProps {
  locale?: string;
  compact?: boolean;
  className?: string;
}

export function NewsletterForm({ locale = "en", compact = false, className }: NewsletterFormProps) {
  const isNp = locale === "np";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || (isNp ? "सदस्यता असफल भयो।" : "Subscription failed."));
        return;
      }

      setStatus("success");
      setMessage(
        isNp ? "धन्यवाद! तपाईं सदस्यता सूचीमा थपिनुभयो।" : "You're subscribed! Watch your inbox for new articles."
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage(isNp ? "नेटवर्क त्रुटि। पुन: प्रयास गर्नुहोस्।" : "Network error. Please try again.");
    }
  }

  return (
    <div className={className}>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex gap-3 max-w-md mx-auto",
          compact ? "flex-col" : "flex-col sm:flex-row"
        )}
      >
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={isNp ? "तपाईंको इमेल ठेगाना प्रविष्ट गर्नुहोस्" : "Enter your email address"}
          className={cn(
            "bg-background border-border text-foreground h-12",
            compact && "h-9 text-sm"
          )}
          required
          disabled={status === "loading"}
        />
        <Button
          type="submit"
          size={compact ? "sm" : "lg"}
          className={cn(
            "shrink-0 bg-primary hover:bg-primary/90 text-white font-semibold",
            compact ? "h-9 w-full" : "h-12 w-full sm:w-auto"
          )}
          disabled={status === "loading"}
        >
          {status === "loading"
            ? isNp
              ? "पर्खनुहोस्..."
              : "Subscribing..."
            : isNp
              ? "अहिले नै सदस्यता लिनुहोस्"
              : "Subscribe Now"}
        </Button>
      </form>
      {message && (
        <p
          className={cn(
            "text-sm mt-3 text-center",
            status === "success" ? "text-primary" : "text-destructive"
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
}
