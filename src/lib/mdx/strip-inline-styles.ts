export function stripInlineStyles(html: string): string {
  return html
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/\sstyle='[^']*'/gi, "");
}
