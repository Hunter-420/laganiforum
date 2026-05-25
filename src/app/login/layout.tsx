import { ThemeProvider } from "@/components/providers/theme-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Laganiforum",
  robots: "noindex, nofollow",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="min-h-dvh bg-background font-sans antialiased">{children}</div>
    </ThemeProvider>
  );
}
