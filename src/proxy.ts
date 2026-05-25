import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://laganiforum.com',
  'https://www.laganiforum.com',
  'https://dev.laganiforum.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (origin.endsWith('.vercel.app')) return true;
  if (process.env.VERCEL_URL && origin === `https://${process.env.VERCEL_URL}`) {
    return true;
  }
  return false;
}

function addCorsHeaders(response: NextResponse, origin: string | null) {
  if (origin && isAllowedOrigin(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,DELETE,OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin');

  if (request.method === 'OPTIONS' && pathname.startsWith('/api')) {
    const preflight = new NextResponse(null, { status: 204 });
    return addCorsHeaders(preflight, origin);
  }

  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const response = NextResponse.next();
    return addCorsHeaders(response, origin);
  }

  if (pathname.startsWith('/login') || pathname.startsWith('/api')) {
    const response = NextResponse.next();
    return addCorsHeaders(response, origin);
  }

  const pathnameHasLocale = ['/en', '/np'].some(
    (locale) => pathname.startsWith(`${locale}/`) || pathname === locale
  );

  if (pathnameHasLocale) {
    const response = NextResponse.next();
    return addCorsHeaders(response, origin);
  }

  const locale = 'en';
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    '/((?!_next|_static|favicon.ico|robots.txt|sitemap.xml|news-sitemap.xml|category-sitemap.xml|stocks-sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf)).*)',
  ],
};
