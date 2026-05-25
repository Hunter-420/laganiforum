export interface TranslatablePost {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverImageAlt: string;
  slug: string;
  category: string;
}

export interface TranslatedPost extends TranslatablePost {
  slug: string;
}

function slugifyEnglish(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

async function callOpenAI(system: string, user: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to .env.local to enable automatic translation."
    );
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Translation API failed: ${err}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Empty translation response");
  return text;
}

export async function translatePostToEnglish(
  source: TranslatablePost
): Promise<TranslatedPost> {
  const metaPrompt = `You are a professional financial content translator (Nepali → English) for a NEPSE/trading education blog.
Return ONLY valid JSON with keys: title, excerpt, coverImageAlt, tags (array of English strings), category (English category name), slug (URL-safe English slug from title).
Preserve meaning; use clear financial English.`;

  const metaJson = await callOpenAI(
    metaPrompt,
    JSON.stringify({
      title: source.title,
      excerpt: source.excerpt,
      coverImageAlt: source.coverImageAlt,
      tags: source.tags,
      category: source.category,
    })
  );

  let meta: {
    title: string;
    excerpt: string;
    coverImageAlt: string;
    tags: string[];
    category: string;
    slug?: string;
  };

  try {
    const cleaned = metaJson.replace(/^```json\s*/i, "").replace(/```\s*$/i, "");
    meta = JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse translated metadata JSON");
  }

  const contentPrompt = `Translate the following HTML article from Nepali to English for a finance education blog.
Rules:
- Keep ALL HTML tags and structure exactly (p, h2, h3, ul, ol, li, blockquote, table, a, img, strong, em, etc.)
- Only translate visible text inside tags
- Do not add script tags or inline event handlers
- Return ONLY the translated HTML, no markdown fences`;

  const translatedContent = await callOpenAI(contentPrompt, source.content);

  const title = meta.title || source.title;
  const slug = meta.slug || slugifyEnglish(title) || `${source.slug}-en`;

  return {
    title,
    excerpt: meta.excerpt || source.excerpt,
    content: translatedContent,
    tags: Array.isArray(meta.tags) ? meta.tags : source.tags,
    coverImageAlt: meta.coverImageAlt || source.coverImageAlt,
    category: meta.category || source.category,
    slug,
  };
}
