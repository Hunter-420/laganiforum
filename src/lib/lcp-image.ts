import { getSiteOrigin } from "@/lib/site-url";

export function toAbsoluteImageUrl(src: string): string {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const origin = getSiteOrigin();
  return src.startsWith("/") ? `${origin}${src}` : `${origin}/${src}`;
}
