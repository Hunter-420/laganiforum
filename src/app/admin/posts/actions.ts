"use server";

import { getDb } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { randomUUID } from "crypto";
import type { AffiliateBlock } from "@/lib/types/db";
import { translatePostToEnglish } from "@/lib/translate";
import { notifySubscribersNewPost, type NewPostNotification } from "@/lib/newsletter";
import { collectPostMediaUrls, diffRemovedMediaUrls } from "@/lib/post-media";
import { deleteMediaUrls, filterUnreferencedMediaUrls } from "@/lib/media-storage";

export interface PostInput {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  language: string;
  category: string;
  tags: string[];
  coverImage: string;
  coverImageAlt: string;
  status: "draft" | "published";
  author: string;
  wordCount: number;
  isFeatured?: boolean;
  affiliate?: AffiliateBlock;
  disclaimer?: string;
}

async function applyFeaturedFlag(
  db: Awaited<ReturnType<typeof getDb>>,
  language: string,
  isFeatured: boolean | undefined,
  excludeId?: ObjectId
) {
  if (!isFeatured) return;
  const filter: Record<string, unknown> = { language, isFeatured: true };
  if (excludeId) filter._id = { $ne: excludeId };
  await db.collection("posts").updateMany(filter, { $set: { isFeatured: false } });
}

function countWords(html: string): number {
  return html.replace(/<[^>]*>/g, "").trim().split(/\s+/).filter(Boolean).length;
}

function scheduleNewPostEmail(post: NewPostNotification) {
  void notifySubscribersNewPost(post).catch((err) =>
    console.error("Newsletter notification failed:", err)
  );
}

export async function createPostAction(postInput: PostInput) {
  const session = await verifySession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const db = await getDb();
    
    const existing = await db.collection("posts").findOne({
      slug: postInput.slug,
      language: postInput.language,
    });
    if (existing) {
      return { success: false, error: "Slug already exists. Please choose a unique URL." };
    }

    await applyFeaturedFlag(db, postInput.language, postInput.isFeatured);

    const post = {
      ...postInput,
      draftKind: "standard" as const,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("posts").insertOne(post);

    if (postInput.status === "published") {
      scheduleNewPostEmail({
        title: postInput.title,
        slug: postInput.slug,
        excerpt: postInput.excerpt,
        language: postInput.language,
        coverImage: postInput.coverImage,
      });
    }

    return { success: true, id: result.insertedId.toString() };
  } catch (error: any) {
    console.error("Failed to create post:", error);
    return { success: false, error: error.message || "Failed to save post" };
  }
}

export async function updatePostAction(id: string, postInput: PostInput) {
  const session = await verifySession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const db = await getDb();
    
    const existing = await db.collection("posts").findOne({
      slug: postInput.slug,
      language: postInput.language,
      _id: { $ne: new ObjectId(id) },
    });
    if (existing) {
      return { success: false, error: "Slug already exists for another post. Please choose a unique URL." };
    }

    await applyFeaturedFlag(db, postInput.language, postInput.isFeatured, new ObjectId(id));

    const previous = await db.collection("posts").findOne({ _id: new ObjectId(id) });
    const wasPublished = previous?.status === "published";

    const { ...fields } = postInput;
    const result = await db.collection("posts").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...fields,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: "Post not found" };
    }

    if (postInput.status === "published" && !wasPublished) {
      scheduleNewPostEmail({
        title: postInput.title,
        slug: postInput.slug,
        excerpt: postInput.excerpt,
        language: postInput.language,
        coverImage: postInput.coverImage,
      });
    }

    if (previous) {
      const removed = diffRemovedMediaUrls(
        {
          coverImage: previous.coverImage,
          content: previous.content,
          affiliate: previous.affiliate,
        },
        {
          coverImage: postInput.coverImage,
          content: postInput.content,
          affiliate: postInput.affiliate,
        }
      );
      if (removed.length > 0) {
        const toDelete = await filterUnreferencedMediaUrls(removed, new ObjectId(id));
        if (toDelete.length > 0) await deleteMediaUrls(toDelete);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update post:", error);
    return { success: false, error: error.message || "Failed to update post" };
  }
}

export async function createEnglishTranslationAction(sourcePostId: string) {
  const session = await verifySession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const db = await getDb();
    const source = await db.collection("posts").findOne({ _id: new ObjectId(sourcePostId) });

    if (!source) return { success: false, error: "Source post not found" };
    if (source.language !== "np") {
      return { success: false, error: "English translations can only be created from Nepali posts." };
    }

    const groupId = source.translationGroupId || randomUUID();
    const enSlug = `${source.slug}-en`;

    const existingEn = await db.collection("posts").findOne({
      $or: [
        { translationGroupId: groupId, language: "en" },
        { slug: enSlug, language: "en" },
      ],
    });
    if (existingEn) {
      return {
        success: false,
        error: "English version already exists.",
        id: existingEn._id.toString(),
      };
    }

    await db.collection("posts").updateOne(
      { _id: source._id },
      { $set: { translationGroupId: groupId } }
    );

    const translated = await translatePostToEnglish({
      title: source.title,
      excerpt: source.excerpt,
      content: source.content,
      tags: source.tags || [],
      coverImageAlt: source.coverImageAlt || "",
      slug: source.slug,
      category: source.category,
    });

    const finalSlug = translated.slug.endsWith("-en")
      ? translated.slug
      : translated.slug || enSlug;

    const enPost = {
      title: translated.title,
      slug: finalSlug,
      content: translated.content,
      excerpt: translated.excerpt,
      language: "en" as const,
      category: translated.category,
      tags: translated.tags,
      coverImage: source.coverImage,
      coverImageAlt: translated.coverImageAlt,
      status: "draft" as const,
      author: source.author,
      wordCount: countWords(translated.content),
      affiliate: source.affiliate,
      translationGroupId: groupId,
      draftKind: "translation" as const,
      isFeatured: false,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("posts").insertOne(enPost);
    return {
      success: true,
      id: result.insertedId.toString(),
      message: "English translation draft created. Review in Translation drafts.",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create translation";
    return { success: false, error: message };
  }
}

export async function deletePostAction(id: string) {
  const session = await verifySession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const db = await getDb();
    const post = await db.collection("posts").findOne({ _id: new ObjectId(id) });

    if (!post) {
      return { success: false, error: "Post not found" };
    }

    const mediaUrls = collectPostMediaUrls({
      coverImage: post.coverImage,
      content: post.content,
      affiliate: post.affiliate,
    });

    const result = await db.collection("posts").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return { success: false, error: "Post not found" };
    }

    if (mediaUrls.length > 0) {
      const toDelete = await filterUnreferencedMediaUrls(mediaUrls);
      if (toDelete.length > 0) await deleteMediaUrls(toDelete);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete post:", error);
    return { success: false, error: error.message || "Failed to delete post" };
  }
}
