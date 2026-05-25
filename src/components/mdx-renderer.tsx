import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { processContent } from "@/lib/mdx/process-content";

const proseP = "mb-6 text-base lg:text-lg font-normal leading-[1.8] text-foreground last:mb-0";
const proseH2 = "mt-10 mb-4 text-2xl font-bold tracking-tight text-foreground scroll-mt-20";
const proseH3 = "mt-8 mb-3 text-xl font-semibold tracking-tight text-foreground scroll-mt-20";
const proseH4 = "mt-6 mb-2 text-lg font-semibold text-foreground scroll-mt-20";
const proseList = "mb-6 space-y-2 text-base lg:text-lg font-normal leading-[1.8] pl-6";
const proseLi = "leading-[1.8]";
const proseBlockquote =
  "my-8 border-l-4 border-emerald-700 pl-5 text-base lg:text-lg italic leading-[1.8] text-muted-foreground";
const proseLink = "font-semibold text-emerald-800 underline underline-offset-2 hover:text-emerald-900 dark:text-emerald-300";

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mt-10 mb-4 text-3xl font-extrabold tracking-tight" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className={proseH2} {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className={proseH3} {...props} />,
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h4 className={proseH4} {...props} />,
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className={proseP} {...props} />,
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={`${proseList} list-disc`} {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={`${proseList} list-decimal`} {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className={proseLi} {...props} />,
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className={proseBlockquote} {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className={proseLink} {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
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
