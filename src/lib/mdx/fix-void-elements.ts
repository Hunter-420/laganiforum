export function fixVoidElements(html: string): string {
  return html
    .replace(/<input([^>]*?)(?<!\s\/)>/gi, "<input$1 />")
    .replace(/<img([^>]*?)(?<!\s\/)>/gi, "<img$1 />")
    .replace(/<br([^>]*?)(?<!\s\/)>/gi, "<br$1 />");
}
