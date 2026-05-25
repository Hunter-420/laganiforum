"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function LocaleSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggleLocale = locale === "en" ? "np" : "en";
  const label = locale === "en" ? "नेपाली" : "English";

  const handleSwitch = async () => {
    setLoading(true);

    const articleMatch = pathname?.match(/^\/(en|np)\/blog\/([^/]+)$/);
    if (articleMatch) {
      const [, fromLocale, slug] = articleMatch;
      try {
        const res = await fetch(
          `/api/posts/locale-path?slug=${encodeURIComponent(slug)}&from=${fromLocale}&to=${toggleLocale}`
        );
        const data = await res.json();
        if (data.path) {
          router.push(data.path);
          return;
        }
      } catch {
        /* fall through to home */
      }
      router.push(`/${toggleLocale}`);
      return;
    }

    if (pathname?.startsWith(`/${locale}`)) {
      router.push(pathname.replace(`/${locale}`, `/${toggleLocale}`));
    } else {
      router.push(`/${toggleLocale}`);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="font-semibold h-11 min-h-11 font-noto-sans-devanagari min-w-[5.5rem] shrink-0"
      onClick={handleSwitch}
      disabled={loading}
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : label}
    </Button>
  );
}
