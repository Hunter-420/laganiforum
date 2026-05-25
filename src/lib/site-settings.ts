import { getDb } from "./db";
import { normalizeFooterSettings, DEFAULT_FOOTER_SETTINGS } from "./footer-settings";
import type { FooterSettings } from "./types/footer";
import type { AffiliateBlock } from "./types/db";
import type { AuthorProfile } from "./types/author";
import { DEFAULT_AUTHORS } from "./types/author";

export interface SiteSettings {
  key: "global";
  categories: string[];
  tags: string[];
  authors: AuthorProfile[];
  adminEmail?: string;
  adminPasswordHash?: string;
  defaultSponsor?: AffiliateBlock;
  footer: FooterSettings;
  updatedAt: Date;
}

function normalizeAuthor(raw: Partial<AuthorProfile>): AuthorProfile | null {
  const name = String(raw.name ?? "").trim();
  if (!name) return null;

  const id = String(raw.id ?? "").trim() || `author-${name.toLowerCase().replace(/\s+/g, "-")}`;

  return {
    id,
    name,
    title: String(raw.title ?? "Market Analyst").trim() || "Market Analyst",
    bio: raw.bio ? String(raw.bio).trim() : undefined,
    photoUrl: raw.photoUrl ? String(raw.photoUrl).trim() : undefined,
    facebookUrl: raw.facebookUrl ? String(raw.facebookUrl).trim() : undefined,
    linkedinUrl: raw.linkedinUrl ? String(raw.linkedinUrl).trim() : undefined,
    twitterUrl: raw.twitterUrl ? String(raw.twitterUrl).trim() : undefined,
    email: raw.email ? String(raw.email).trim() : undefined,
    isDefault: !!raw.isDefault,
  };
}

function normalizeAuthors(raw: unknown): AuthorProfile[] {
  if (!Array.isArray(raw)) return DEFAULT_AUTHORS;

  const authors = raw
    .map((item) => normalizeAuthor(item as Partial<AuthorProfile>))
    .filter((a): a is AuthorProfile => a !== null);

  return authors.length > 0 ? authors : DEFAULT_AUTHORS;
}

export function resolveAuthor(
  authors: AuthorProfile[],
  authorName: string
): AuthorProfile | undefined {
  const normalized = authorName.trim().toLowerCase();
  if (!normalized) return authors.find((a) => a.isDefault) || authors[0];

  return (
    authors.find((a) => a.name.trim().toLowerCase() === normalized) ||
    authors.find((a) => a.id.trim().toLowerCase() === normalized) ||
    authors.find((a) => a.isDefault) ||
    authors[0]
  );
}

export function getAuthorById(
  authors: AuthorProfile[],
  authorId: string
): AuthorProfile | undefined {
  const id = authorId.trim().toLowerCase();
  return authors.find((a) => a.id.trim().toLowerCase() === id);
}

const DEFAULT_CATEGORIES = [
  "Technical Analysis",
  "Fundamental Analysis",
  "Trading Psychology",
  "NEPSE Update",
  "Global Market",
  "Personal Finance",
  "Forex",
];

const DEFAULT_TAGS = [
  "NEPSE",
  "Swing Trading",
  "Forex",
  "Technical Analysis",
  "Risk Management",
];

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const db = await getDb();
    const doc = await db.collection("settings").findOne({ key: "global" });
    if (doc) {
      return {
        key: "global",
        categories: doc.categories?.length ? doc.categories : DEFAULT_CATEGORIES,
        tags: doc.tags?.length ? doc.tags : DEFAULT_TAGS,
        authors: normalizeAuthors(doc.authors),
        adminEmail: doc.adminEmail,
        adminPasswordHash: doc.adminPasswordHash,
        defaultSponsor: doc.defaultSponsor,
        footer: normalizeFooterSettings(doc.footer),
        updatedAt: doc.updatedAt || new Date(),
      };
    }
  } catch {
    /* fall through */
  }

  return {
    key: "global",
    categories: DEFAULT_CATEGORIES,
    tags: DEFAULT_TAGS,
    authors: DEFAULT_AUTHORS,
    footer: DEFAULT_FOOTER_SETTINGS,
    updatedAt: new Date(),
  };
}

export async function saveSiteSettings(
  partial: Partial<Omit<SiteSettings, "key" | "updatedAt">>
): Promise<void> {
  const db = await getDb();
  const authors = partial.authors
    ? normalizeAuthors(partial.authors)
    : undefined;

  await db.collection("settings").updateOne(
    { key: "global" },
    {
      $set: {
        ...partial,
        ...(authors ? { authors } : {}),
        key: "global",
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
}
