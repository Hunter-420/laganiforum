import { getDb } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { EditPostClient } from "./edit-client";
import { getSiteSettings } from "@/lib/site-settings";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch (e) {
    notFound();
  }

  const db = await getDb();
  const post = await db.collection("posts").findOne({ _id: objectId });

  if (!post) {
    notFound();
  }

  // Convert MongoDB document to plain object for client component props
  const initialData = {
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    language: post.language,
    category: post.category,
    tags: post.tags,
    coverImage: post.coverImage,
    coverImageAlt: post.coverImageAlt,
    status: post.status,
    author: post.author,
    wordCount: post.wordCount,
    affiliate: post.affiliate,
    isFeatured: !!post.isFeatured,
    disclaimer: post.disclaimer || "",
    draftKind: post.draftKind,
    id: id,
  };

  const settings = await getSiteSettings();

  return (
    <EditPostClient
      initialData={initialData}
      postId={id}
      categories={settings.categories}
      tags={settings.tags}
      authors={settings.authors}
    />
  );
}
