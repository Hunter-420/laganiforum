import { Suspense, type ComponentType } from "react";
import { getDb } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Eye, BarChart3, Star, Languages } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { AdminPostsToolbar } from "@/components/admin/admin-posts-toolbar";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSiteSettings } from "@/lib/site-settings";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tab?: string }>;
}) {
  const session = await verifySession();
  if (!session) redirect("/login");

  const { category, tab } = await searchParams;
  const settings = await getSiteSettings();
  const db = await getDb();

  const filter: Record<string, unknown> = {};
  if (category && category !== "all") filter.category = category;

  if (tab === "published") filter.status = "published";
  else if (tab === "drafts") {
    filter.status = "draft";
    filter.draftKind = { $ne: "translation" };
  } else if (tab === "translation") {
    filter.status = "draft";
    filter.draftKind = "translation";
  }

  const [posts, topPosts, totalEvents] = await Promise.all([
    db.collection("posts").find(filter).sort({ createdAt: -1 }).toArray(),
    db
      .collection("posts")
      .find({ status: "published" }, { projection: { title: 1, views: 1 } })
      .sort({ views: -1 })
      .limit(5)
      .toArray(),
    db.collection("analytics").countDocuments(),
  ]);

  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
  const publishedCount = await db.collection("posts").countDocuments({ status: "published" });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Posts</h1>
          <p className="text-muted-foreground text-sm">Manage your blog content and articles.</p>
        </div>
        <Link href="/admin/posts/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div className="h-20 mb-6 bg-muted/30 rounded-lg animate-pulse" />}>
        <AdminPostsToolbar categories={settings.categories} />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatMini icon={Eye} label="Views (this list)" value={totalViews} />
        <StatMini icon={BarChart3} label="Page events" value={totalEvents} />
        <StatMini icon={BarChart3} label="Published total" value={publishedCount} />
      </div>

      {topPosts.length > 0 && tab !== "translation" && (
        <div className="bg-card border rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-sm">Top viewed</h2>
            <Link href="/admin/analytics" className="text-sm text-primary hover:underline">
              Analytics
            </Link>
          </div>
          <div className="divide-y">
            {topPosts.map((post, i) => (
              <div key={post._id.toString()} className="px-4 py-2.5 flex justify-between text-sm">
                <span className="truncate pr-4">
                  #{i + 1} {post.title}
                </span>
                <span className="text-primary font-semibold shrink-0">{post.views || 0}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        {posts.length === 0 ? (
          <p className="p-12 text-center text-muted-foreground text-sm">No posts match this filter.</p>
        ) : (
          <div className="divide-y">
            {posts.map((post) => (
              <div
                key={post._id.toString()}
                className="p-4 flex items-center justify-between gap-4 hover:bg-muted/40"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{post.title}</h3>
                    <Badge variant={post.status === "published" ? "default" : "secondary"}>
                      {post.status}
                    </Badge>
                    {post.draftKind === "translation" && (
                      <Badge variant="outline" className="gap-1 border-violet-500/50 text-violet-600">
                        <Languages className="w-3 h-3" />
                        Translation
                      </Badge>
                    )}
                    {post.isFeatured && (
                      <Badge variant="outline" className="gap-1 border-amber-500/50 text-amber-600">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground flex flex-wrap gap-x-2">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>{post.language?.toUpperCase()}</span>
                    <span>·</span>
                    <span>{post.category}</span>
                    <span>·</span>
                    <span>{post.wordCount} words</span>
                    {post.status === "published" && (
                      <>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views || 0}
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link href={`/admin/posts/${post._id.toString()}/edit`}>
                    <Button variant="ghost" size="icon">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </Link>
                  <DeletePostButton id={post._id.toString()} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatMini({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-card border rounded-xl p-4 flex items-center gap-3">
      <Icon className="w-5 h-5 text-primary shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold tabular-nums">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}
