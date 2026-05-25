"use server";

import { env } from "@/lib/env";
import { createSession } from "@/lib/auth";
import { getSiteSettings } from "@/lib/site-settings";
import { verifyPassword } from "@/lib/password";

export async function loginAction(email: string, password: string) {
  const settings = await getSiteSettings();
  const expectedEmail = settings.adminEmail || env.ADMIN_EMAIL;

  const passwordOk =
    (settings.adminPasswordHash && verifyPassword(password, settings.adminPasswordHash)) ||
    (!settings.adminPasswordHash && password === env.ADMIN_PASSWORD) ||
    password === env.ADMIN_PASSWORD;

  if (email === expectedEmail && passwordOk) {
    await createSession(email);
    return { success: true };
  }

  return { success: false, error: "Invalid email or password" };
}
