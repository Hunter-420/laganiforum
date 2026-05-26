import type { Viewport } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { themeBlockingScript } from "@/lib/theme-script";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/fabicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Mukta:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: themeBlockingScript }}
          suppressHydrationWarning
        />
      </head>
      <body className="min-h-dvh overflow-x-hidden antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
