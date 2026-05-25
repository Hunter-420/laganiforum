/** First block of text for author cards (stops at blank line or second paragraph). */
export function getFirstParagraph(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";

  const byBlankLine = trimmed.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  if (byBlankLine.length > 0) return byBlankLine[0];

  const firstLine = trimmed.split("\n").map((l) => l.trim()).find(Boolean);
  return firstLine ?? trimmed;
}
