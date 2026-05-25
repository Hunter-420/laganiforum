"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { useDialog } from "@/components/ui/dialog";
import { updateSettingsAction, updateAdminCredentialsAction } from "./actions";
import type { AffiliateBlock } from "@/lib/types/db";
import type { AuthorProfile } from "@/lib/types/author";
import { AuthorsSettings } from "@/components/admin/authors-settings";
import { FooterSettingsEditor } from "@/components/admin/footer-settings";
import type { FooterSettings } from "@/lib/types/footer";
import { DEFAULT_FOOTER_SETTINGS } from "@/lib/footer-settings";

interface SettingsClientProps {
  initial: {
    categories: string[];
    tags: string[];
    authors: AuthorProfile[];
    defaultSponsor?: AffiliateBlock;
    adminEmail?: string;
    hasCustomPassword: boolean;
    footer: FooterSettings;
  };
}

export function SettingsClient({ initial }: SettingsClientProps) {
  const { toast } = useDialog();
  const [categories, setCategories] = useState(initial.categories);
  const [tags, setTags] = useState(initial.tags);
  const [authors, setAuthors] = useState(initial.authors);
  const [footer, setFooter] = useState(initial.footer ?? DEFAULT_FOOTER_SETTINGS);
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);

  const [sponsor, setSponsor] = useState<AffiliateBlock>(
    initial.defaultSponsor || {
      title: "",
      description: "",
      image: "",
      ctaText: "",
      url: "",
    }
  );

  const [adminEmail, setAdminEmail] = useState(initial.adminEmail || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const saveContentSettings = async () => {
    setSaving(true);
    const result = await updateSettingsAction({
      categories,
      tags,
      authors,
      defaultSponsor:
        sponsor.title && sponsor.url
          ? sponsor
          : null,
      footer,
    });
    setSaving(false);
    if (result.success) toast("Settings saved", "success");
    else toast(result.error || "Failed to save", "error");
  };

  const saveCredentials = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      toast("Passwords do not match", "error");
      return;
    }
    setSaving(true);
    const result = await updateAdminCredentialsAction({
      email: adminEmail || undefined,
      currentPassword,
      newPassword: newPassword || undefined,
    });
    setSaving(false);
    if (result.success) {
      toast("Credentials updated", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast(result.error || "Failed to update", "error");
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin credentials</CardTitle>
          <CardDescription>
            Change login email or password. Env vars still work as fallback until a custom password is set.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Admin email</label>
            <Input value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin@laganiforum.com" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Current password</label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">New password</label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Confirm password</label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          </div>
          <Button onClick={saveCredentials} disabled={saving || !currentPassword} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Update credentials
          </Button>
        </CardContent>
      </Card>

      <FooterSettingsEditor footer={footer} onChange={setFooter} />

      <AuthorsSettings authors={authors} onChange={setAuthors} />

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Used in the post editor and blog filters.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-2">
            {categories.map((cat, i) => (
              <li key={cat} className="flex items-center gap-2">
                <Input
                  value={cat}
                  onChange={(e) => {
                    const next = [...categories];
                    next[i] = e.target.value;
                    setCategories(next);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive shrink-0"
                  onClick={() => setCategories(categories.filter((_, j) => j !== i))}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (newCategory.trim()) {
                  setCategories([...categories, newCategory.trim()]);
                  setNewCategory("");
                }
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>Suggested tags for the post editor.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm"
              >
                {tag}
                <button
                  type="button"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="New tag" />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (newTag.trim()) {
                  setTags([...tags, newTag.trim()]);
                  setNewTag("");
                }
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default sponsor card</CardTitle>
          <CardDescription>Pre-fills the affiliate block when creating new posts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Title" value={sponsor.title} onChange={(e) => setSponsor({ ...sponsor, title: e.target.value })} />
          <textarea
            className="w-full min-h-[80px] rounded-lg border bg-background px-3 py-2 text-sm"
            placeholder="Description"
            value={sponsor.description}
            onChange={(e) => setSponsor({ ...sponsor, description: e.target.value })}
          />
          <Input placeholder="Target URL" value={sponsor.url} onChange={(e) => setSponsor({ ...sponsor, url: e.target.value })} />
          <Input placeholder="CTA text" value={sponsor.ctaText} onChange={(e) => setSponsor({ ...sponsor, ctaText: e.target.value })} />
          <Input placeholder="Image URL" value={sponsor.image || ""} onChange={(e) => setSponsor({ ...sponsor, image: e.target.value })} />
        </CardContent>
      </Card>

      <Button onClick={saveContentSettings} disabled={saving} className="gap-2">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save content settings
      </Button>
    </div>
  );
}
