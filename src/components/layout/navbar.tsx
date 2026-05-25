"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SearchDialog } from "@/components/layout/search-dialog";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Menu, X, ChevronDown } from "lucide-react";

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
    <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <Container>
        <div className="flex h-14 md:h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4 md:gap-6 min-w-0">
            <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
              <Image
                src="/logo.svg"
                alt="Laganiforum"
                width={32}
                height={32}
                className="h-7 w-7 md:h-8 md:w-8"
              />
              <span className="font-bold text-lg tracking-tight text-primary hidden sm:inline">
                Laganiforum
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-5 text-lg font-bold">
              <Link
                href={`/${locale}`}
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                {isNp ? "गृहपृष्ठ" : "Home"}
              </Link>

              <div
                className="relative"
                onMouseEnter={() => setCategoryDropdownOpen(true)}
                onMouseLeave={() => setCategoryDropdownOpen(false)}
              >
                <Link
                  href={`/${locale}/blog`}
                  className="flex items-center gap-1 text-foreground/80 hover:text-primary transition-colors py-2"
                >
                  {isNp ? "बजार विश्लेषण" : "Analysis"}
                  <ChevronDown className="w-3.5 h-3.5" />
                </Link>
                {categoryDropdownOpen && (
                  <div className="absolute top-full left-0 w-52 bg-background border rounded-lg shadow-lg py-1 z-50">
                    {categories.map((cat) => (
                      <Link
                        key={cat}
                        href={`/${locale}/blog?category=${encodeURIComponent(cat)}`}
                        className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-primary"
                        onClick={() => setCategoryDropdownOpen(false)}
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href={`/${locale}/market`}
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                {isNp ? "लाइभ बजार" : "Markets"}
              </Link>
              <a
                href="https://app.laganiforum.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                {isNp ? "ब्याकटेस्टिङ" : "Backtesting"}
              </a>
              <Link
                href={`/${locale}/about`}
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                {isNp ? "हाम्रो बारेमा" : "About"}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <SearchDialog locale={locale} open={searchOpen} onOpenChange={setSearchOpen} />
            <ThemeToggle />
            <LocaleSwitcher locale={locale} />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </Container>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 shadow-lg">
          <nav className="flex flex-col gap-3 text-sm font-medium">
            <Link href={`/${locale}`} onClick={() => setMobileMenuOpen(false)}>
              {isNp ? "गृहपृष्ठ" : "Home"}
            </Link>
            <Link href={`/${locale}/blog`} onClick={() => setMobileMenuOpen(false)}>
              {isNp ? "बजार विश्लेषण" : "Analysis"}
            </Link>
            <div className="pl-3 border-l flex flex-col gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/${locale}/blog?category=${encodeURIComponent(cat)}`}
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat}
                </Link>
              ))}
            </div>
            <Link href={`/${locale}/market`} onClick={() => setMobileMenuOpen(false)}>
              {isNp ? "लाइभ बजार" : "Markets"}
            </Link>
            <Link href={`/${locale}/about`} onClick={() => setMobileMenuOpen(false)}>
              {isNp ? "हाम्रो बारेमा" : "About"}
            </Link>
            <button
              type="button"
              className="text-left text-foreground/80"
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
