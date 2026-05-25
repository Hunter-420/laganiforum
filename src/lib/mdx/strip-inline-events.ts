export function stripInlineEvents(html: string): string {
  return html.replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
}
