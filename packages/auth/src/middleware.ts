import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export interface MiddlewareConfig {
  publicRoutes?: string[];
  protectedRoutes?: string[];
  adminRoutes?: string[];
}

const defaultConfig: MiddlewareConfig = {
  publicRoutes: ['/', '/login', '/signup', '/explore', '/listing'],
  protectedRoutes: ['/dashboard', '/onboarding', '/messages'],
  adminRoutes: ['/admin'],
};

export function createAuthMiddleware(config: MiddlewareConfig = defaultConfig) {
  return async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionToken = request.cookies.get('authjs.session-token')?.value;
    const isLoggedIn = !!sessionToken;

    // Check if route is public
    const isPublicRoute = config.publicRoutes?.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isPublicRoute) {
      return NextResponse.next();
    }

    // Check if route is protected
    const isProtectedRoute = config.protectedRoutes?.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isProtectedRoute && !isLoggedIn) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if route is admin-only
    const isAdminRoute = config.adminRoutes?.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isAdminRoute) {
      // Note: Full admin check requires session data, handled in page/layout
      if (!isLoggedIn) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    return NextResponse.next();
  };
}
