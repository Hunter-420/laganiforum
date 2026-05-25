import { removeScripts } from "./remove-scripts";
import { stripInlineEvents } from "./strip-inline-events";
import { removeJavascriptUrls } from "./remove-javascript-urls";
import { fixVoidElements } from "./fix-void-elements";
import { sanitizeMDXContent } from "./sanitize-mdx";
import { stripInlineStyles } from "./strip-inline-styles";

export function processContent(content: string): string {
  if (!content) return "";

  let html = content;
  html = removeScripts(html);
  html = stripInlineEvents(html);
  html = removeJavascriptUrls(html);
  html = fixVoidElements(html);
  html = stripInlineStyles(html);
  html = sanitizeMDXContent(html);
  return html;
}
