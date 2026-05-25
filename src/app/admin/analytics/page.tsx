import { getDb } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ComponentType } from "react";
import { BarChart3, Eye, TrendingUp, Calendar } from "lucide-react";
import { getViewsByDate } from "@/lib/analytics-views";
import { ViewsChart } from "@/components/admin/views-chart";

export default async function AnalyticsPage() {
  const session = await verifySession();
  if (!session) redirect("/login");

  const db = await getDb();

  const [totalEvents, posts, viewsByDate] = await Promise.all([
    db.collection("analytics").countDocuments(),
    db
      .collection("posts")
      .find(
        { status: "published" },
        { projection: { title: 1, views: 1, language: 1, category: 1 } }
      )
      .sort({ views: -1 })
      .toArray(),
    getViewsByDate(30),
  ]);

  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
  const totalPosts = posts.length;
  const avgViews = totalPosts > 0 ? Math.round(totalViews / totalPosts) : 0;
  const viewsInRange = viewsByDate.reduce((s, d) => s + d.views, 0);

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Analytics</h1>
        <p className="text-muted-foreground text-sm">
          Traffic trends and top-performing articles.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Eye} label="Total article views" value={totalViews} color="primary" />
        <StatCard icon={Calendar} label="Views (30 days)" value={viewsInRange} color="violet" />
        <StatCard icon={TrendingUp} label="Avg views / post" value={avgViews} color="emerald" />
        <StatCard icon={BarChart3} label="Published posts" value={totalPosts} color="blue" />
      </div>

      <div className="mb-8">
        <ViewsChart data={viewsByDate} totalInRange={viewsInRange} />
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between">
          <h3 className="font-semibold">Top articles</h3>
          <span className="text-xs text-muted-foreground">{totalEvents} tracked events</span>
        </div>

        {posts.length === 0 ? (
          <p className="p-12 text-center text-muted-foreground text-sm">
            No published posts yet.
          </p>
        ) : (
          <div className="divide-y">
            {posts.map((post, index) => (
              <div
                key={post._id.toString()}
                className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-muted/40"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-sm font-bold text-muted-foreground w-6">#{index + 1}</span>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {post.language.toUpperCase()} · {post.category}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full shrink-0">
                  <Eye className="w-3.5 h-3.5" />
                  {post.views || 0}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: "primary" | "emerald" | "blue" | "violet";
}) {
  const colors = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  };

  return (
    <div className="bg-card border rounded-xl p-5">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-0.5 tabular-nums">{value.toLocaleString()}</p>
    </div>
  );
}
