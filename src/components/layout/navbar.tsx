"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Menu, X, ChevronDown } from "lucide-react";

const ThemeToggle = dynamic(
  () => import("@/components/layout/theme-toggle").then((m) => ({ default: m.ThemeToggle })),
  { ssr: false }
);

const SearchDialog = dynamic(
  () => import("@/components/layout/search-dialog").then((m) => ({ default: m.SearchDialog })),
  { ssr: false }
);

const navLinkClass =
  "inline-flex min-h-10 items-center rounded-lg px-3 text-[15px] font-semibold text-foreground/85 hover:text-emerald-800 hover:bg-muted/70 dark:hover:text-emerald-300 transition-colors";

export function Navbar({ locale }: { locale: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const categories = [
    "NEPSE",
    "Forex",
    "Technical Analysis",
    "Fundamental Analysis",
    "Personal Finance",
    "Global Market",
  ];
  const isNp = locale === "np";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <Container>
        <div className="flex h-[3.75rem] md:h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-5 min-w-0">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2.5 shrink-0 min-h-11 rounded-lg pr-1 hover:opacity-90 transition-opacity"
            >
              <Image
                src="/logo.png"
                alt="Laganiforum home"
                width={160}
                height={46}
                priority
                className="h-9 md:h-11 w-auto"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-0.5">
              <Link href={`/${locale}`} className={navLinkClass}>
                {isNp ? "गृहपृष्ठ" : "Home"}
              </Link>

              <div
                className="relative"
                onMouseEnter={() => setCategoryDropdownOpen(true)}
                onMouseLeave={() => setCategoryDropdownOpen(false)}
              >
                <Link href={`/${locale}/blog`} className={`${navLinkClass} gap-1`}>
                  {isNp ? "बजार विश्लेषण" : "Analysis"}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`}
                  />
                </Link>
                {categoryDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-border bg-background/95 py-1.5 shadow-lg backdrop-blur-sm z-50">
                    {categories.map((cat) => (
                      <Link
                        key={cat}
                        href={`/${locale}/blog?category=${encodeURIComponent(cat)}`}
                        className="flex min-h-10 items-center px-4 text-sm font-medium text-foreground/90 hover:bg-muted hover:text-emerald-800 dark:hover:text-emerald-300"
                        onClick={() => setCategoryDropdownOpen(false)}
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href={`/${locale}/market`} className={navLinkClass}>
                {isNp ? "लाइभ बजार" : "Markets"}
              </Link>
              <a
                href="https://app.laganiforum.com"
                target="_blank"
                rel="noopener noreferrer"
                className={navLinkClass}
              >
                {isNp ? "ब्याकटेस्टिङ" : "Backtesting"}
              </a>
              <Link href={`/${locale}/about`} className={navLinkClass}>
                {isNp ? "हाम्रो बारेमा" : "About"}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 min-h-11 shrink-0 rounded-xl border border-border/60 bg-muted/30 px-1 sm:px-1.5 py-1">
            <SearchDialog locale={locale} open={searchOpen} onOpenChange={setSearchOpen} />
            <ThemeToggle />
            <LocaleSwitcher locale={locale} />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden min-h-10 min-w-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </Container>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/98 px-4 py-4 shadow-lg">
          <nav className="flex flex-col gap-0.5 text-sm font-medium">
            <Link
              href={`/${locale}`}
              className="min-h-11 flex items-center rounded-lg px-3 hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              {isNp ? "गृहपृष्ठ" : "Home"}
            </Link>
            <Link
              href={`/${locale}/blog`}
              className="min-h-11 flex items-center rounded-lg px-3 hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              {isNp ? "बजार विश्लेषण" : "Analysis"}
            </Link>
            <div className="ml-3 border-l border-border flex flex-col gap-0.5 pl-3">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  className="min-h-10 flex items-center rounded-lg px-3 text-foreground/80 hover:bg-muted hover:text-emerald-800"
                  href={`/${locale}/blog?category=${encodeURIComponent(cat)}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat}
                </Link>
              ))}
            </div>
            <Link
              href={`/${locale}/market`}
              className="min-h-11 flex items-center rounded-lg px-3 hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              {isNp ? "लाइभ बजार" : "Markets"}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="min-h-11 flex items-center rounded-lg px-3 hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              {isNp ? "हाम्रो बारेमा" : "About"}
            </Link>
            <button
              type="button"
              className="min-h-11 flex items-center rounded-lg px-3 text-left text-foreground/80 hover:bg-muted"
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen(true);
              }}
            >
              {isNp ? "खोज" : "Search"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
