import { NextResponse } from "next/server";
import { getPostLocalePath } from "@/lib/posts";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!slug || !from || !to) {
    return NextResponse.json({ error: "Missing slug, from, or to" }, { status: 400 });
  }

  const path = await getPostLocalePath(slug, from, to);
  return NextResponse.json({ path, available: !!path });
}
