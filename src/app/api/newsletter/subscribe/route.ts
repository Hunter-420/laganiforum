import { NextRequest, NextResponse } from "next/server";
import { subscribeNewsletter } from "@/lib/newsletter";

export async function POST(request: NextRequest) {
  let body: { email?: string; locale?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = body.email?.trim();
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const locale = body.locale === "np" ? "np" : "en";
  const result = await subscribeNewsletter(email, locale);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
