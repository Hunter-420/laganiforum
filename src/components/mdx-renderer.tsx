import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { processContent } from "@/lib/mdx/process-content";

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 {...props} />,
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h4 {...props} />,
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props} />,
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul {...props} />,
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => <ol {...props} />,
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li {...props} />,
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => <blockquote {...props} />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} />,
  strong: (props: React.HTMLAttributes<HTMLElement>) => <strong {...props} />,
  img: ({ alt, src }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (!src || typeof src !== "string") return null;
    return (
      <span className="relative block my-10 aspect-video max-h-[600px] overflow-hidden rounded-2xl border bg-muted shadow-sm">
        <OptimizedImage
          src={src}
          alt={alt || "Article illustration"}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </span>
    );
  },
};

export function MDXRenderer({ source }: { source: string }) {
  const safeContent = processContent(source);
  return <MDXRemote source={safeContent} components={components} />;
}
