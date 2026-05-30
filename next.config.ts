import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://s3.tradingview.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' https: data: blob:",
      "font-src 'self' data: https://fonts.gstatic.com https://fonts.googleapis.com",
      "connect-src 'self' https: data:",
      "frame-src 'self' https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  allowedDevOrigins: [
    "laganiforum.com",
    "www.laganiforum.com",
    "dev.laganiforum.com",
    "localhost:3000",
  ],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@tiptap/react",
      "@tiptap/starter-kit",
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async redirects() {
    return [
      // www → non-www (permanent 301).
      // Without this, www.laganiforum.com serves real pages whose canonical
      // points to non-www. Google correctly labels those as "Alternate page
      // with proper canonical tag" — they should redirect instead.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.laganiforum.com" }],
        destination: "https://laganiforum.com/:path*",
        permanent: true,
      },
      // http → https belt-and-suspenders redirect (Vercel handles this at edge
      // but explicit redirect ensures no http variant leaks into GSC).
      {
        source: "/:path*",
        has: [{ type: "header", key: "x-forwarded-proto", value: "http" }],
        destination: "https://laganiforum.com/:path*",
        permanent: true,
      },
      // Old URL redirects
      {
        source: "/category/:slug*",
        destination: "/en/blog?category=:slug*",
        permanent: true,
      },
      {
        source: "/tag/:slug*",
        destination: "/en/blog?tag=:slug*",
        permanent: true,
      },
      {
        source: "/author/:id",
        destination: "/en/author/:id",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Requested-With, X-Api-Key",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
