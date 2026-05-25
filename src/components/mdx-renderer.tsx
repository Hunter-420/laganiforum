import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { processContent } from "@/lib/mdx/process-content";

// Custom components map for MDX
const components = {
  h1: (props: any) => <h1 className="text-4xl font-extrabold mt-12 mb-6" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-bold mt-10 mb-5" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-semibold mt-8 mb-4" {...props} />,
  p: (props: any) => <p className="text-lg leading-8 mb-6" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-6 mb-6 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 mb-6 space-y-2" {...props} />,
  li: (props: any) => <li className="text-lg" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 italic text-muted-foreground bg-muted/20 rounded-r-lg" {...props} />
  ),
  a: (props: any) => <a className="text-primary hover:underline font-medium" {...props} />,
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
