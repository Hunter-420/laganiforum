"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth";
import { getSiteSettings, saveSiteSettings } from "@/lib/site-settings";
import { hashPassword } from "@/lib/password";
import type { AffiliateBlock } from "@/lib/types/db";
import type { AuthorProfile } from "@/lib/types/author";

function serializeAuthors(authors: AuthorProfile[]): AuthorProfile[] {
  return authors.map((a) => ({
    id: String(a.id),
    name: String(a.name),
    title: String(a.title || ""),
    bio: a.bio ? String(a.bio) : "",
    photoUrl: a.photoUrl ? String(a.photoUrl) : "",
    facebookUrl: a.facebookUrl ? String(a.facebookUrl) : "",
    linkedinUrl: a.linkedinUrl ? String(a.linkedinUrl) : "",
    twitterUrl: a.twitterUrl ? String(a.twitterUrl) : "",
    email: a.email ? String(a.email) : "",
    isDefault: !!a.isDefault,
  }));
}

export async function getSettingsAction() {
  const session = await verifySession();
  if (!session) return { success: false, error: "Unauthorized" };

  const settings = await getSiteSettings();
  return {
    success: true,
    settings: {
      categories: settings.categories,
      tags: settings.tags,
      defaultSponsor: settings.defaultSponsor,
      authors: settings.authors,
      adminEmail: settings.adminEmail,
      hasCustomPassword: !!settings.adminPasswordHash,
    },
  };
}

export async function updateSettingsAction(data: {
  categories: string[];
  tags: string[];
  authors?: AuthorProfile[];
  defaultSponsor?: AffiliateBlock | null;
}) {
  const session = await verifySession();
  if (!session) return { success: false, error: "Unauthorized" };

  await saveSiteSettings({
    categories: data.categories.filter(Boolean),
    tags: data.tags.filter(Boolean),
    authors: data.authors ? serializeAuthors(data.authors.filter((a) => a.name.trim())) : undefined,
    defaultSponsor: data.defaultSponsor || undefined,
  });

  revalidatePath("/en", "layout");
  revalidatePath("/np", "layout");
  revalidatePath("/en/blog", "layout");
  revalidatePath("/np/blog", "layout");

  return { success: true };
}

export async function updateAdminCredentialsAction(data: {
  email?: string;
  currentPassword: string;
  newPassword?: string;
}) {
  const session = await verifySession();
  if (!session) return { success: false, error: "Unauthorized" };

  const { env } = await import("@/lib/env");
  const settings = await getSiteSettings();

  const passwordValid =
    data.currentPassword === env.ADMIN_PASSWORD ||
    (settings.adminPasswordHash &&
      (await import("@/lib/password")).verifyPassword(
        data.currentPassword,
        settings.adminPasswordHash
      ));

  if (!passwordValid) {
    return { success: false, error: "Current password is incorrect." };
  }

  const updates: Parameters<typeof saveSiteSettings>[0] = {};
  if (data.email) updates.adminEmail = data.email;
  if (data.newPassword && data.newPassword.length >= 8) {
    updates.adminPasswordHash = hashPassword(data.newPassword);
  }

  await saveSiteSettings(updates);
  return { success: true };
}
