import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { DialogProvider } from "@/components/ui/dialog";
import Link from "next/link";
import { FileText, Image as ImageIcon, BarChart3, LogOut, Settings } from "lucide-react";
import { deleteSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();

  if (!session) {
    redirect("/login");
  }

  return (
      <DialogProvider>
        <div className="flex flex-1 w-full min-h-dvh bg-background font-sans antialiased">
          <aside className="w-64 border-r border-border bg-card flex-col md:flex hidden shrink-0">
            <div className="h-16 flex items-center px-6 border-b border-border">
              <span className="font-extrabold text-xl tracking-tight text-primary">LF Admin</span>
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
              <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground/80 hover:text-foreground transition-colors">
                <FileText className="w-4 h-4" />
                Posts
              </Link>
              <Link href="/admin/media" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground/80 hover:text-foreground transition-colors">
                <ImageIcon className="w-4 h-4" />
                Media
              </Link>
              <Link href="/admin/analytics" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground/80 hover:text-foreground transition-colors">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Link>
              <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground/80 hover:text-foreground transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </nav>

            <div className="p-4 border-t border-border">
              <form action={async () => {
                "use server";
                await deleteSession();
                redirect("/login");
              }}>
                <button type="submit" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-destructive/10 text-destructive w-full transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </form>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-h-screen overflow-hidden min-w-0">
            <header className="h-16 border-b border-border bg-card/50 backdrop-blur flex items-center px-8 md:hidden">
              <span className="font-extrabold tracking-tight text-primary">LF Admin</span>
            </header>
            <div className="flex-1 overflow-auto p-8">
              {children}
            </div>
          </main>
        </div>
      </DialogProvider>
  );
}
