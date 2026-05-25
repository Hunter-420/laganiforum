"use client";

import React, { useEffect, useState } from "react";
import { List } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ isNp }: { isNp: boolean }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Wait a brief moment for the MDX/HTML to render
    const timeoutId = setTimeout(() => {
      const articleElement = document.getElementById("article-content");
      if (!articleElement) return;

      const elements = Array.from(articleElement.querySelectorAll("h2, h3"));
      
      const parsedHeadings: Heading[] = elements.map((el) => {
        let id = el.id;
        if (!id) {
          // Generate a slugified ID if none exists
          id = el.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9\u0900-\u097F]+/g, "-") // includes Nepali devanagari unicode range
            .replace(/(^-|-$)+/g, "") || Math.random().toString(36).substr(2, 9);
          el.id = id;
        }

        return {
          id,
          text: el.textContent || "",
          level: Number(el.tagName.charAt(1)),
        };
      });

      setHeadings(parsedHeadings);

      // Setup Intersection Observer to highlight active section
      const observerCallback: IntersectionObserverCallback = (entries) => {
        // Find the topmost visible heading
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      };

      const observerOptions = {
        rootMargin: "0px 0px -80% 0px",
        threshold: 1.0,
      };

      const observer = new IntersectionObserver(observerCallback, observerOptions);

      elements.forEach((el) => observer.observe(el));

      return () => {
        elements.forEach((el) => observer.unobserve(el));
        observer.disconnect();
      };
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky navbar
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="bg-muted/30 rounded-xl p-6 border border-border">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <List className="w-5 h-5 text-primary" />
        {isNp ? "विषयसूची" : "Table of Contents"}
      </h3>
      <nav>
        <ul className="space-y-3 text-sm">
          {headings.map((heading) => (
            <li 
              key={heading.id} 
              className={`transition-colors ${heading.level === 3 ? "ml-4" : ""}`}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={`block transition-colors hover:text-primary ${
                  activeId === heading.id ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
