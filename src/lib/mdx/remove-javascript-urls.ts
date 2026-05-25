export function removeJavascriptUrls(html: string): string {
  return html.replace(/javascript:/gi, "");
}
