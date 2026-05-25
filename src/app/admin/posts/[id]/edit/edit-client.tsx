"use client";

import { updatePostAction, createEnglishTranslationAction, type PostInput } from "../../actions";
import { PostForm } from "@/components/admin/post-form";
import type { AuthorProfile } from "@/lib/types/author";

export function EditPostClient({
  initialData,
  postId,
  categories,
  tags,
  authors,
}: {
  initialData: PostInput & { id?: string };
  postId: string;
  categories: string[];
  tags: string[];
  authors: AuthorProfile[];
}) {
  const handleSave = async (status: "draft" | "published", data: PostInput) => {
    return updatePostAction(postId, data);
  };

  const handleCreateEnglish = async () => {
    return createEnglishTranslationAction(postId) as Promise<{
      success: boolean;
      error?: string;
      id?: string;
      message?: string;
    }>;
  };

  return (
    <PostForm
      initialData={initialData}
      onSave={handleSave}
      title="Edit Post"
      categories={categories}
      tagSuggestions={tags}
      authors={authors}
      onCreateEnglishTranslation={
        initialData.language === "np" ? handleCreateEnglish : undefined
      }
    />
  );
}
