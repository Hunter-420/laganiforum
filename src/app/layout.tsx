import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { themeBlockingScript } from "@/lib/theme-script";
import { getSiteOrigin } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  // metadataBase must live in the ROOT layout so every page — regardless of
  // which layout subtree renders — resolves relative canonical/OG URLs to the
  // correct absolute origin. Without this, Next.js falls back to localhost in
  // production edge-cases, producing broken <link rel="canonical"> tags.
  metadataBase: new URL(getSiteOrigin()),
  icons: {
    icon: [
      { url: "/fabicon.png", type: "image/png" },
    ],
    shortcut: "/fabicon.png",
    apple: "/fabicon.png",
  },
};

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
