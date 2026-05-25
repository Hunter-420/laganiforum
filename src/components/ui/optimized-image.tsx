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

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        fetchPriority={fetchPriority}
        sizes={sizes ?? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      fetchPriority={fetchPriority}
      sizes={sizes}
      className={className}
    />
  );
}
