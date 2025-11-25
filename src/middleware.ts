import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";

// Create base middleware
const baseMiddleware = createMiddleware(routing);

// Enhanced middleware function
export default async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Skip for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes("/static/") ||
    pathname.includes(".") // Skip files with extensions
  ) {
    return NextResponse.next();
  }

  // Check if the path starts with a locale
  const hasLocalePrefix = /^\/(?:ru|en|uz)(?:\/|$)/.test(pathname);

  // If no locale prefix, redirect to the default locale (ru)
  if (!hasLocalePrefix) {
    const newUrl = new URL(`/ru${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // Use the base middleware for all other cases
  return baseMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
