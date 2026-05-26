import { getSiteOrigin } from "@/lib/site-url";

export const FEATURED_LCP_IMAGE = "/images/featured/nepse-backtesting.webp";

export const FEATURED_LCP_SIZES = "(max-width: 640px) 100vw, 378px";

export const FEATURED_LCP_WIDTH = 800;
export const FEATURED_LCP_HEIGHT = 534;

export function isLocalAsset(src: string): boolean {
  return src.startsWith("/") && !src.startsWith("//");
}

export function toAbsoluteImageUrl(src: string): string {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const origin = getSiteOrigin();
  return src.startsWith("/") ? `${origin}${src}` : `${origin}/${src}`;
}


export function getFeaturedImageProps(src: string) {
  return {
    unoptimized: false,
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 662px",
    width: FEATURED_LCP_WIDTH,
    height: FEATURED_LCP_HEIGHT,
  };
}
