"use client";

import { useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2, Upload, User } from "lucide-react";
import type { AuthorProfile } from "@/lib/types/author";
import { useDialog } from "@/components/ui/dialog";

interface AuthorsSettingsProps {
  authors: AuthorProfile[];
  onChange: (authors: AuthorProfile[]) => void;
}

export function AuthorsSettings({ authors, onChange }: AuthorsSettingsProps) {
  const { toast } = useDialog();
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const updateAuthor = (id: string, patch: Partial<AuthorProfile>) => {
    onChange(authors.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const addAuthor = () => {
    const id = `author-${Date.now()}`;
    onChange([
      ...authors,
      { id, name: "", title: "Market Analyst", bio: "", photoUrl: "", facebookUrl: "" },
    ]);
  };

  const removeAuthor = (id: string) => {
    if (authors.length <= 1) {
      toast("Keep at least one author", "error");
      return;
    }
    onChange(authors.filter((a) => a.id !== id));
  };

  const uploadPhoto = async (id: string, file: File) => {
    setUploadingId(id);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/image", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      updateAuthor(id, { photoUrl: url });
      toast("Photo uploaded", "success");
    } catch {
      toast("Photo upload failed", "error");
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authors</CardTitle>
        <CardDescription>
          Manage bylines shown on articles — name, photo, title, and social links.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {authors.map((author) => (
          <div
            key={author.id}
            className="rounded-xl border bg-muted/20 p-4 space-y-4"
          >
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                {author.photoUrl ? (
                  <img
                    src={author.photoUrl}
                    alt={author.name}
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-muted border flex items-center justify-center">
                    <User className="w-7 h-7 text-muted-foreground" />
                  </div>
                )}
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow"
                  onClick={() => fileRefs.current[author.id]?.click()}
                  disabled={uploadingId === author.id}
                >
                  {uploadingId === author.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                </button>
                <input
                  ref={(el) => {
                    fileRefs.current[author.id] = el;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadPhoto(author.id, file);
                    e.target.value = "";
                  }}
                />
              </div>

              <div className="flex-1 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Name</label>
                  <Input
                    value={author.name}
                    onChange={(e) => updateAuthor(author.id, { name: e.target.value })}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Title</label>
                  <Input
                    value={author.title}
                    onChange={(e) => updateAuthor(author.id, { title: e.target.value })}
                    placeholder="Market Analyst"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground">Facebook URL</label>
                  <Input
                    value={author.facebookUrl || ""}
                    onChange={(e) => updateAuthor(author.id, { facebookUrl: e.target.value })}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground">Short bio</label>
                  <textarea
                    className="w-full min-h-[60px] rounded-lg border bg-background px-3 py-2 text-sm"
                    value={author.bio || ""}
                    onChange={(e) => updateAuthor(author.id, { bio: e.target.value })}
                    placeholder="Optional bio for author pages"
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive shrink-0"
                onClick={() => removeAuthor(author.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="defaultAuthor"
                checked={!!author.isDefault}
                onChange={() =>
                  onChange(
                    authors.map((a) => ({
                      ...a,
                      isDefault: a.id === author.id,
                    }))
                  )
                }
              />
              Default author for new posts
            </label>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addAuthor} className="gap-2">
          <Plus className="w-4 h-4" />
          Add author
        </Button>
      </CardContent>
    </Card>
  );
}
