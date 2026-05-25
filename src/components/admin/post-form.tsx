"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  Loader2,
  Languages,
  FileText,
  Tags,
  ImageIcon,
  Megaphone,
} from "lucide-react";
import type { AuthorProfile } from "@/lib/types/author";
import Link from "next/link";
import { RichTextEditor } from "@/components/admin/editor";
import { type PostInput } from "@/app/admin/posts/actions";
import { uploadBase64ImagesInContent } from "@/lib/upload-content-images";
import { useDialog } from "@/components/ui/dialog";
import type { AffiliateBlock } from "@/lib/types/db";

interface PostFormProps {
  initialData?: Partial<PostInput> & { id?: string };
  onSave: (status: "draft" | "published", data: PostInput) => Promise<{ success: boolean; error?: string; id?: string }>;
  title: string;
  categories?: string[];
  tagSuggestions?: string[];
  authors?: AuthorProfile[];
  defaultSponsor?: AffiliateBlock;
  onCreateEnglishTranslation?: () => Promise<{
    success: boolean;
    error?: string;
    id?: string;
    message?: string;
  }>;
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadSingleImage(base64OrUrl: string): Promise<string> {
  // If it's already an https URL (not base64), skip upload
  if (base64OrUrl.startsWith("http")) return base64OrUrl;

  const res = await fetch(base64OrUrl);
  const blob = await res.blob();
  const file = new File([blob], `cover-${Date.now()}.webp`, { type: blob.type });
  const formData = new FormData();
  formData.append("file", file);

  const uploadRes = await fetch("/api/upload/image", { method: "POST", body: formData });
  if (!uploadRes.ok) throw new Error("Cover image upload failed");
  const { url } = await uploadRes.json();
  return url;
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

export function PostForm({
  initialData,
  onSave,
  title: pageTitle,
  categories = DEFAULT_CATEGORIES,
  tagSuggestions = [],
  authors = [],
  defaultSponsor,
  onCreateEnglishTranslation,
}: PostFormProps) {
  const defaultAuthor =
    authors.find((a) => a.isDefault) || authors[0];
  const router = useRouter();
  const { confirm, toast } = useDialog();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const affiliateImgInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [category, setCategory] = useState(initialData?.category || "Technical Analysis");
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [coverImageAlt, setCoverImageAlt] = useState(initialData?.coverImageAlt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [language, setLanguage] = useState(initialData?.language || "en");
  const [author, setAuthor] = useState(
    initialData?.author || defaultAuthor?.name || "Pitamber Gautam"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [error, setError] = useState("");

  // Affiliate fields
  const [affiliateTitle, setAffiliateTitle] = useState(initialData?.affiliate?.title || "");
  const [affiliateDesc, setAffiliateDesc] = useState(initialData?.affiliate?.description || "");
  const [affiliateImage, setAffiliateImage] = useState(initialData?.affiliate?.image || "");
  const [affiliateCta, setAffiliateCta] = useState(initialData?.affiliate?.ctaText || "");
  const [affiliateUrl, setAffiliateUrl] = useState(initialData?.affiliate?.url || "");
  const [isAffiliateOpen, setIsAffiliateOpen] = useState(
    !!(initialData?.affiliate || defaultSponsor?.title)
  );
  const [translating, setTranslating] = useState(false);
  const [isFeatured, setIsFeatured] = useState(!!initialData?.isFeatured);
  const [disclaimer, setDisclaimer] = useState(initialData?.disclaimer || "");

  const wordCount = useMemo(() => {
    const text = content.replace(/<[^>]*>?/gm, "");
    return text.trim().split(/\s+/).filter((w) => w.length > 0).length;
  }, [content]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")) {
      setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
    }
  };

  // Preview cover image from local file (base64), actual upload happens on save
  const handleCoverFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setCoverImage(base64);
    e.target.value = "";
  };

  // Preview affiliate image from local file (base64), actual upload happens on save
  const handleAffiliateImgSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setAffiliateImage(base64);
    e.target.value = "";
  };

  const performSave = async (status: "draft" | "published") => {
    setIsSubmitting(true);
    setError("");

    try {
      // Step 1: Upload cover image if it's base64
      setSubmitStatus("Uploading cover image...");
      const finalCoverImage = await uploadSingleImage(coverImage);

      // Step 2: Upload affiliate image if it's base64
      let finalAffiliateImage = affiliateImage;
      if (affiliateImage && !affiliateImage.startsWith("http")) {
        setSubmitStatus("Uploading affiliate image...");
        finalAffiliateImage = await uploadSingleImage(affiliateImage);
      }

      // Step 3: Upload all inline base64 images from editor content
      setSubmitStatus("Uploading inline images...");
      const finalContent = await uploadBase64ImagesInContent(content);

      setSubmitStatus("Saving post...");

      const postInput: PostInput = {
        title,
        slug,
        content: finalContent,
        excerpt,
        language,
        category,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        coverImage: finalCoverImage,
        coverImageAlt,
        status,
        author,
        wordCount,
        isFeatured,
        affiliate:
          affiliateTitle && affiliateUrl
            ? {
                title: affiliateTitle,
                description: affiliateDesc,
                image: finalAffiliateImage,
                ctaText: affiliateCta,
                url: affiliateUrl,
              }
            : undefined,
        disclaimer: disclaimer.trim() || undefined,
      };

      const result = await onSave(status, postInput);

      if (result.success) {
        const publicUrl = `/${language}/blog/${slug}`;
        if (status === "published") {
          toast(`Published — ${window.location.origin}${publicUrl}`, "success");
        } else {
          toast("Draft saved successfully", "success");
        }
        router.push("/admin");
      } else {
        setError(result.error || "Failed to save post");
        window.scrollTo(0, 0);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while saving.");
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
      setSubmitStatus("");
    }
  };

  const handleSave = (status: "draft" | "published") => {
    if (!title || !slug || !content || !coverImage || !coverImageAlt || !excerpt) {
      setError("Please fill out all required fields: Title, Slug, Excerpt, Cover Image, Alt Text, and Content.");
      window.scrollTo(0, 0);
      return;
    }

    if (status === "published" && wordCount < 1500) {
      confirm({
        title: "Low word count",
        description: `Your post has ${wordCount} words. SEO guidelines recommend 1,500+. Publish anyway?`,
        confirmLabel: "Publish anyway",
        cancelLabel: "Keep editing",
        onConfirm: () => performSave(status),
      });
      return;
    }

    void performSave(status);
  };

  const handleCreateEnglish = () => {
    if (!onCreateEnglishTranslation) return;
    confirm({
      title: "Create English version",
      description:
        "This creates a new English draft linked to this Nepali post. Translate the title and body before publishing.",
      confirmLabel: "Create draft",
      onConfirm: async () => {
        setTranslating(true);
        const result = await onCreateEnglishTranslation();
        setTranslating(false);
        if (result.success && result.id) {
          toast(
            result.message || "English translation draft created — check Translation drafts tab",
            "success"
          );
          router.push("/admin?tab=translation");
        } else {
          toast(result.error || "Failed to create translation", "error");
        }
      },
    });
  };

  const inputClass =
    "w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
  const labelClass = "block text-xs font-medium mb-1.5 text-muted-foreground uppercase tracking-wide";
  const cardClass = "rounded-xl border bg-card shadow-sm overflow-hidden";
  const cardHeadClass = "flex items-center gap-2 px-5 py-3 border-b bg-muted/30 text-sm font-semibold";
  const selectedAuthor = authors.find((a) => a.name === author);

  return (
    <div className="max-w-6xl mx-auto pb-28">
      <div className="sticky top-0 z-20 -mx-4 px-4 py-3 mb-6 bg-background/95 backdrop-blur border-b flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl font-bold truncate">{pageTitle}</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span
                className={
                  wordCount < 1500
                    ? "text-amber-600 dark:text-amber-400 font-medium"
                    : "text-emerald-600 dark:text-emerald-400 font-medium"
                }
              >
                {wordCount} words
              </span>
              <span>· 1500+ recommended for publish</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {language === "np" && initialData?.id && onCreateEnglishTranslation && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleCreateEnglish}
              disabled={isSubmitting || translating}
              className="gap-2"
            >
              {translating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
              English version
            </Button>
          )}
          <Button variant="outline" onClick={() => handleSave("draft")} disabled={isSubmitting} className="gap-2">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </Button>
          <Button onClick={() => handleSave("published")} disabled={isSubmitting} className="gap-2">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            Publish
          </Button>
        </div>
      </div>

      {/* Status messages */}
      {isSubmitting && submitStatus && (
        <div className="bg-primary/10 text-primary font-medium p-4 rounded-xl mb-6 flex items-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin" />
          {submitStatus}
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive font-medium p-4 rounded-xl mb-6">{error}</div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-5 min-w-0">
          <div className={cardClass}>
            <div className={cardHeadClass}>
              <FileText className="w-4 h-4 text-primary" />
              Article
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className={labelClass}>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Write a clear, keyword-rich headline…"
                  className="w-full h-12 px-4 rounded-lg border border-input bg-background text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className={labelClass}>Body</label>
                <RichTextEditor content={content} onChange={setContent} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className={cardClass}>
            <div className={cardHeadClass}>
              <FileText className="w-4 h-4 text-primary" />
              SEO
            </div>
            <div className="p-5 space-y-4">

            <div>
              <label className={labelClass}>URL Slug</label>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="keyword-slug" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Meta Description</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Compelling meta description for CTR..."
                rows={3}
                className="w-full p-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            <div>
              <label className={labelClass}>Author</label>
              {authors.length > 0 ? (
                <>
                  <select
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className={inputClass}
                  >
                    {authors.map((a) => (
                      <option key={a.id} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                  {selectedAuthor?.photoUrl && (
                    <img
                      src={selectedAuthor.photoUrl}
                      alt=""
                      className="mt-2 w-10 h-10 rounded-full object-cover border"
                    />
                  )}
                </>
              ) : (
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className={inputClass}
                />
              )}
            </div>
            </div>
          </div>

          <div className={cardClass}>
            <div className={cardHeadClass}>
              <Tags className="w-4 h-4 text-primary" />
              Publish
            </div>
            <div className="p-5 space-y-4">

            <div>
              <label className={labelClass}>Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={inputClass}
                disabled={!!initialData?.id && initialData.language === "en"}
              >
                <option value="en">English (EN)</option>
                <option value="np" disabled={!!initialData?.id && initialData.language === "en"}>
                  Nepali (NP)
                </option>
              </select>
              {initialData?.id && initialData.language === "en" && (
                <p className="text-xs text-muted-foreground mt-1">
                  English posts cannot be converted to Nepali. Create the Nepali article first, then use &quot;English version&quot;.
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-input"
              />
              <span className="text-sm font-medium">Featured on homepage</span>
            </label>

            <div>
              <label className={labelClass}>Custom disclaimer (optional)</label>
              <textarea
                className="w-full min-h-[72px] rounded-lg border bg-background px-3 py-2 text-sm leading-relaxed"
                value={disclaimer}
                onChange={(e) => setDisclaimer(e.target.value)}
                placeholder="Leave empty to use the site default. “Read full disclaimer” is always shown at the end."
              />
            </div>

            <div>
              <label className={labelClass}>Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Comma separated"
                className={inputClass}
              />
              {tagSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tagSuggestions.slice(0, 8).map((t) => (
                    <button
                      key={t}
                      type="button"
                      className="text-xs px-2 py-0.5 rounded-md border hover:bg-muted"
                      onClick={() => {
                        const current = tags
                          .split(",")
                          .map((x) => x.trim())
                          .filter(Boolean);
                        if (!current.includes(t)) {
                          setTags([...current, t].join(", "));
                        }
                      }}
                    >
                      + {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
            </div>
          </div>

          <div className={cardClass}>
            <div className={cardHeadClass}>
              <ImageIcon className="w-4 h-4 text-primary" />
              Cover image
            </div>
            <div className="p-5 space-y-4">

            <div>
              <label className={labelClass}>Cover Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coverImage.startsWith("data:") ? "(local file — uploads on save)" : coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://... or upload a file"
                  className="flex-1 h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="px-3 h-10 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 whitespace-nowrap"
                >
                  Browse
                </button>
                <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverFileSelect} />
              </div>
              {coverImage && (
                <div className="mt-3 w-full aspect-video bg-muted rounded-lg overflow-hidden border">
                  <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Cover Image Alt Text (SEO)</label>
              <input
                type="text"
                value={coverImageAlt}
                onChange={(e) => setCoverImageAlt(e.target.value)}
                placeholder="Descriptive alt text for SEO..."
                className={inputClass}
              />
            </div>
            </div>
          </div>

          <div className={cardClass}>
            <button
              type="button"
              onClick={() => setIsAffiliateOpen(!isAffiliateOpen)}
              className={`${cardHeadClass} w-full text-left`}
            >
              <Megaphone className="w-4 h-4 text-primary" />
              <span className="flex-1">Sponsor card</span>
              <span className="text-xs font-normal text-muted-foreground">
                {isAffiliateOpen ? "Hide" : "Optional"}
              </span>
            </button>

            {isAffiliateOpen && (
              <div className="space-y-4 p-5 pt-0">
                <div>
                  <label className={labelClass}>Title</label>
                  <input type="text" value={affiliateTitle} onChange={(e) => setAffiliateTitle(e.target.value)} placeholder="Best Trading Platform" className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={affiliateDesc}
                    onChange={(e) => setAffiliateDesc(e.target.value)}
                    placeholder="Short description..."
                    rows={2}
                    className="w-full p-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>

                <div>
                  <label className={labelClass}>Target URL</label>
                  <input type="text" value={affiliateUrl} onChange={(e) => setAffiliateUrl(e.target.value)} placeholder="https://..." className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>CTA Button Text</label>
                  <input type="text" value={affiliateCta} onChange={(e) => setAffiliateCta(e.target.value)} placeholder="Sign Up Now" className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Affiliate Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={affiliateImage.startsWith("data:") ? "(local file — uploads on save)" : affiliateImage}
                      onChange={(e) => setAffiliateImage(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button
                      type="button"
                      onClick={() => affiliateImgInputRef.current?.click()}
                      className="px-3 h-10 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 whitespace-nowrap"
                    >
                      Browse
                    </button>
                    <input ref={affiliateImgInputRef} type="file" accept="image/*" className="hidden" onChange={handleAffiliateImgSelect} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
