import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import * as mammoth from "mammoth";

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let html = "";

    if (file.name.endsWith(".docx")) {
      const result = await mammoth.convertToHtml({ buffer });
      html = result.value;
    } else if (file.name.endsWith(".md") || file.name.endsWith(".mdx")) {
      // In a real app we might parse markdown to HTML. Tiptap can handle some markdown pasting,
      // but passing it as plain text here might require marked or showdown.
      // For simplicity, we just return the text.
      const text = buffer.toString('utf-8');
      // basic md to html conversion for heading, etc. using regex is frail.
      // We will just return the text and let the frontend insert it.
      return NextResponse.json({ text });
    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    return NextResponse.json({ html });
  } catch (error: any) {
    console.error("Document import failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to import document" },
      { status: 500 }
    );
  }
}
