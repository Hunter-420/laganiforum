import { getSiteSettings } from "@/lib/site-settings";
import { NewPostClient } from "./new-post-client";

export default async function NewPostPage() {
  const settings = await getSiteSettings();
  return (
    <NewPostClient
      categories={settings.categories}
      tags={settings.tags}
      authors={settings.authors}
      defaultSponsor={settings.defaultSponsor}
    />
  );
}
