import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSiteSettings } from "@/lib/site-settings";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const session = await verifySession();
  if (!session) redirect("/login");

  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Credentials, categories, tags, and default sponsor card.
        </p>
      </div>
      <SettingsClient
        initial={{
          categories: settings.categories,
          tags: settings.tags,
          defaultSponsor: settings.defaultSponsor,
          authors: settings.authors,
          adminEmail: settings.adminEmail,
          hasCustomPassword: !!settings.adminPasswordHash,
        }}
      />
    </div>
  );
}
