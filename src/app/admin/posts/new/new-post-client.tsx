"use client";

import { createPostAction, type PostInput } from "../actions";
import { PostForm } from "@/components/admin/post-form";
import type { AffiliateBlock } from "@/lib/types/db";
import type { AuthorProfile } from "@/lib/types/author";

export function NewPostClient({
  categories,
  tags,
  authors,
  defaultSponsor,
}: {
  categories: string[];
  tags: string[];
  authors: AuthorProfile[];
  defaultSponsor?: AffiliateBlock;
}) {
  const defaultAuthor = authors.find((a) => a.isDefault) || authors[0];

  const handleSave = async (status: "draft" | "published", data: PostInput) => {
    return createPostAction(data);
  };

  return (
    <PostForm
      onSave={handleSave}
      title="Create New Post"
      categories={categories}
      tagSuggestions={tags}
      authors={authors}
      defaultSponsor={defaultSponsor}
      initialData={{
        language: "en",
        category: categories[0] || "Technical Analysis",
        author: defaultAuthor?.name,
        ...(defaultSponsor?.title ? { affiliate: defaultSponsor } : {}),
      }}
    />
  );
}
