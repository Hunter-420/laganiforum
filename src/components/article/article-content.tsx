import { MDXRenderer } from "@/components/mdx-renderer";
import { processContent } from "@/lib/mdx/process-content";

function isHtmlContent(content: string): boolean {
  const trimmed = content.trim();
  return trimmed.startsWith("<") && /<\/?[a-z][\s\S]*>/i.test(trimmed);
}

interface ArticleContentProps {
  source: string;
  locale: string;
}

export function ArticleContent({ source, locale }: ArticleContentProps) {
  if (isHtmlContent(source)) {
    const html = processContent(source);
    return (
      <div
        className={locale === "np" ? "article-prose article-prose-np" : "article-prose"}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className={locale === "np" ? "article-prose article-prose-np" : "article-prose"}>
      <MDXRenderer source={source} />
    </div>
  );
}
