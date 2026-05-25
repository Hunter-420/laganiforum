import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { validateAutomationApiKey } from "@/lib/automation-auth";

const BLOCKED_PHRASES = [
  "guaranteed profit",
  "risk-free investment",
  "100% win rate",
  "double your money",
  "secret trading strategy",
  "banks don't want you to know",
  "easy passive income with no risk",
];

const REQUIRED_DISCLAIMER =
  "This content is for educational purposes only and not financial advice.";

function detectBlockedPhrases(content: string): string[] {
  const lower = content.toLowerCase();
  return BLOCKED_PHRASES.filter((phrase) => lower.includes(phrase));
}

export async function POST(request: NextRequest) {
  if (!validateAutomationApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized. Invalid or missing API key." }, { status: 401 });
  }

  let body: any;
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
  } = body;

  const missing = ["title", "slug", "content", "excerpt", "category", "author"].filter(
    (f) => !body[f]
  );
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const blocked = detectBlockedPhrases(content + " " + title);
  if (blocked.length > 0) {
    return NextResponse.json(
      {
        error: "YMYL violation: blocked finance phrases detected.",
        blocked_phrases: blocked,
      },
      { status: 422 }
    );
  }

  if (!content.toLowerCase().includes("educational purposes only")) {
    return NextResponse.json(
      {
        error: `Missing required disclaimer. Must include: "${REQUIRED_DISCLAIMER}"`,
      },
      { status: 422 }
    );
  }

  const wordCount = content.replace(/<[^>]*>/g, "").trim().split(/\s+/).filter(Boolean).length;
  if (wordCount < 800) {
    return NextResponse.json(
      { error: `Content too thin. Minimum 800 words required. Got ${wordCount}.` },
      { status: 422 }
    );
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
    title,
    slug,
    content,
    excerpt,
    language,
    category,
    tags,
    coverImage,
    coverImageAlt,
    author,
    status,
    wordCount,
    affiliate: affiliate || null,
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("posts").insertOne(post);

  const publicUrl = `https://laganiforum.com/${language}/blog/${slug}`;

  return NextResponse.json({
    success: true,
    id: result.insertedId.toString(),
    slug,
    status,
    publicUrl: status === "published" ? publicUrl : null,
    message:
      status === "published"
        ? `Post published at ${publicUrl}`
        : `Draft created. Publish when ready.`,
  });
}
