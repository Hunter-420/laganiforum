import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getClientIp, hashIp } from "@/lib/analytics";
import type { AnalyticsDocument } from "@/lib/types/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, locale } = body;

    if (!slug || !locale) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const path = `/${locale}/blog/${slug}`;
    const ip = getClientIp(request);
    const ipHash = hashIp(ip);
    const userAgent = request.headers.get("user-agent") || "unknown";

    const db = await getDb();

    const analyticsDoc: AnalyticsDocument = {
      path,
      ipHash,
      userAgent,
      timestamp: new Date(),
    };

    await Promise.all([
      db.collection("analytics").insertOne(analyticsDoc),
      db.collection("posts").updateOne(
        { slug, language: locale, status: "published" },
        { $inc: { views: 1 } }
      ),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to track analytics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
