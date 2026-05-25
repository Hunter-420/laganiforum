import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      className={`flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground ${className ?? ""}`}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1.5 min-w-0">
            {index > 0 && (
              <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" aria-hidden />
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors truncate max-w-[180px] sm:max-w-none"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`truncate max-w-[200px] sm:max-w-md ${isLast ? "text-foreground font-medium" : ""}`}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
