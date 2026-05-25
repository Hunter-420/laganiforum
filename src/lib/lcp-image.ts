import { getImageProps } from "next/image";
import { getSiteOrigin } from "@/lib/site-url";

export const FEATURED_LCP_IMAGE = "/images/featured/nepse-backtesting.webp";

export const FEATURED_LCP_SIZES = "(max-width: 768px) 100vw, 50vw";

export const FEATURED_LCP_WIDTH = 1200;
export const FEATURED_LCP_HEIGHT = 800;

export function isLocalAsset(src: string): boolean {
  return src.startsWith("/") && !src.startsWith("//");
}

export function toAbsoluteImageUrl(src: string): string {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const origin = getSiteOrigin();
  return src.startsWith("/") ? `${origin}${src}` : `${origin}/${src}`;
}

/** Preload href must match what next/image will request (or the static file when unoptimized). */
export function getLcpPreloadHref(
  src: string,
  options: {
    width?: number;
    height?: number;
    sizes?: string;
    unoptimized?: boolean;
  } = {}
): string {
  const {
    width = FEATURED_LCP_WIDTH,
    height = FEATURED_LCP_HEIGHT,
    sizes = FEATURED_LCP_SIZES,
    unoptimized = isLocalAsset(src),
  } = options;

  if (unoptimized) {
    return toAbsoluteImageUrl(src);
  }

  const { props } = getImageProps({
    alt: "",
    src,
    width,
    height,
    sizes,
    quality: 75,
    priority: true,
  });

  return props.src;
}

export function getFeaturedImageProps(src: string) {
  const unoptimized = isLocalAsset(src);
  return {
    unoptimized,
    sizes: FEATURED_LCP_SIZES,
    width: FEATURED_LCP_WIDTH,
    height: FEATURED_LCP_HEIGHT,
  };
}
