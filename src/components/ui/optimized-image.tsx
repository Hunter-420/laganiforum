import Image from "next/image";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  fetchPriority,
  fill = false,
  width = 1200,
  height = 675,
  sizes,
}: OptimizedImageProps) {
  if (!src) return null;

  const resolvedAlt = alt?.trim() || "Article illustration";
  const defaultSizes = fill
    ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    : "(max-width: 768px) 100vw, 768px";

  if (fill) {
    return (
      <Image
        src={src}
        alt={resolvedAlt}
        fill
        priority={priority}
        fetchPriority={fetchPriority ?? (priority ? "high" : "auto")}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        sizes={sizes ?? defaultSizes}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={resolvedAlt}
      width={width}
      height={height}
      priority={priority}
      fetchPriority={fetchPriority ?? (priority ? "high" : "auto")}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      sizes={sizes ?? defaultSizes}
      className={className}
    />
  );
}
