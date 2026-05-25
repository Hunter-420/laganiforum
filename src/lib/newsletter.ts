import { getDb } from "@/lib/db";
import { env } from "@/lib/env";
import { getArticleUrl } from "@/lib/site-url";

const COLLECTION = "newsletter_subscribers";

export async function subscribeNewsletter(
  email: string,
  locale = "en"
): Promise<{ success: boolean; error?: string }> {
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const db = await getDb();
  await db.collection(COLLECTION).updateOne(
    { email: normalized },
    {
      $set: {
        email: normalized,
        locale,
        active: true,
        subscribedAt: new Date(),
      },
    },
    { upsert: true }
  );

  return { success: true };
}

export interface NewPostNotification {
  title: string;
  slug: string;
  excerpt: string;
  language: string;
  coverImage?: string;
}

async function sendResendEmail(payload: {
  from: string;
  to: string;
  bcc?: string[];
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    return { ok: false, error: body };
  }
  return { ok: true };
}

export async function notifySubscribersNewPost(
  post: NewPostNotification
): Promise<{ sent: number; skipped?: string }> {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    return { sent: 0, skipped: "Resend not configured" };
  }

  const db = await getDb();
  const subscribers = await db
    .collection(COLLECTION)
    .find({ active: true })
    .project({ email: 1 })
    .toArray();

  const emails = subscribers.map((s) => s.email as string).filter(Boolean);
  if (emails.length === 0) return { sent: 0 };

  const articleUrl = getArticleUrl(post.language, post.slug);
  const subject =
    post.language === "np"
      ? `नयाँ लेख: ${post.title}`
      : `New article: ${post.title}`;
  const html = buildNewPostEmailHtml(post, articleUrl);

  let sent = 0;
  const batchSize = 50;
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    const { ok, error } = await sendResendEmail({
      from: env.RESEND_FROM_EMAIL,
      to: env.RESEND_FROM_EMAIL,
      bcc: batch,
      subject,
      html,
    });
    if (!ok) {
      console.error("Newsletter send failed:", error);
      break;
    }
    sent += batch.length;
  }

  return { sent };
}

function buildNewPostEmailHtml(post: NewPostNotification, articleUrl: string): string {
  const imageBlock = post.coverImage
    ? `<img src="${post.coverImage}" alt="" width="560" style="max-width:100%;border-radius:12px;margin:16px 0;" />`
    : "";

  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#18181b;">
      <p style="font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:0.05em;">Laganiforum</p>
      <h1 style="font-size:22px;line-height:1.3;margin:0 0 12px;">${escapeHtml(post.title)}</h1>
      ${imageBlock}
      <p style="font-size:16px;line-height:1.6;color:#3f3f46;">${escapeHtml(post.excerpt)}</p>
      <p style="margin:24px 0;">
        <a href="${articleUrl}" style="display:inline-block;background:#10b981;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
          Read the full article
        </a>
      </p>
      <p style="font-size:12px;color:#a1a1aa;">You subscribed to Laganiforum market updates.</p>
    </div>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
