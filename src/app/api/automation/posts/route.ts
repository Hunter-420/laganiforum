import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { validateAutomationApiKey } from "@/lib/automation-auth";
import type { PostInput } from "@/app/admin/posts/actions";

const BLOCKED_PHRASES = [
  "guaranteed profit",
  "risk-free investment",
  "100% win rate",
  "double your money",
  "secret trading strategy",
  "banks don't want you to know",
  "easy passive income with no risk",
];

function detectBlockedPhrases(content: string): string[] {
  const lower = content.toLowerCase();
  return BLOCKED_PHRASES.filter((phrase) => lower.includes(phrase));
}

function countWords(content: string): number {
  return content.replace(/<[^>]*>/g, "").trim().split(/\s+/).filter(Boolean).length;
}

export async function POST(request: NextRequest) {
  if (!validateAutomationApiKey(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Provide Authorization: Bearer <AUTOMATION_API_KEY>." },
      { status: 401 }
    );
  }

  let body: Partial<PostInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const {
    title,
    slug,
    content,
    excerpt,
    language = "en",
    category,
    tags = [],
    coverImage = "",
    coverImageAlt = "",
    author,
    status = "draft",
    affiliate,
    wordCount: providedWordCount,
  } = body;

  const missing = ["title", "slug", "content", "excerpt", "category", "author"].filter(
    (f) => !body[f as keyof PostInput]
  );
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const wordCount = providedWordCount ?? countWords(content!);

  if (status === "published") {
    const blocked = detectBlockedPhrases(`${content} ${title}`);
    if (blocked.length > 0) {
      return NextResponse.json(
        { error: "YMYL violation: blocked finance phrases detected.", blocked_phrases: blocked },
        { status: 422 }
      );
    }
    if (wordCount < 800) {
      return NextResponse.json(
        { error: `Content too thin for publish. Minimum 800 words. Got ${wordCount}.` },
        { status: 422 }
      );
    }
  }

  const db = await getDb();
  const existing = await db.collection("posts").findOne({ slug, language });
  if (existing) {
    return NextResponse.json(
      { error: `Slug "${slug}" already exists for language "${language}".` },
      { status: 409 }
    );
  }

  const post = {
    title: title!,
    slug: slug!,
    content: content!,
    excerpt: excerpt!,
    language,
    category: category!,
    tags,
    coverImage,
    coverImageAlt,
    author: author!,
    status,
    wordCount,
    affiliate: affiliate || undefined,
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("posts").insertOne(post);

  if (status === "published") {
    const { notifySubscribersNewPost } = await import("@/lib/newsletter");
    void notifySubscribersNewPost({
      title: title!,
      slug: slug!,
      excerpt: excerpt!,
      language,
      coverImage,
    }).catch((err) => console.error("Newsletter notification failed:", err));
  }

  const publicUrl = `https://laganiforum.com/${language}/blog/${slug}`;

  return NextResponse.json({
    success: true,
    id: result.insertedId.toString(),
    slug,
    status,
    publicUrl: status === "published" ? publicUrl : null,
  });
}
