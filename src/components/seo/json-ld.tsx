import Script from "next/script";

function jsonLdId(data: Record<string, unknown>): string {
  const type = typeof data["@type"] === "string" ? data["@type"] : "schema";
  let hash = 0;
  const raw = JSON.stringify(data);
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return `jsonld-${type}-${Math.abs(hash)}`;
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <Script
      id={jsonLdId(data)}
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
