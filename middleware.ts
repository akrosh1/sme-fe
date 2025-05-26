import { jwtDecode } from 'jwt-decode';
import { NextRequest, NextResponse } from 'next/server';

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access')?.value;
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/cms', '/users'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Define public routes (where authenticated users should be redirected away)
  const publicRoutes = [
    '/login',
    '/register',
    '/forget-password',
    '/reset-password',
  ];
  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  // Helper to check if token is valid
  const isTokenValid = (token: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  };

  // Handle protected routes
  if (isProtectedRoute) {
    if (!accessToken || !isTokenValid(accessToken)) {
      // Redirect to login if no valid token
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Handle public routes
  if (isPublicRoute && accessToken && isTokenValid(accessToken)) {
    // Redirect authenticated users away from public routes
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/cms/:path*',
    '/users/:path*',
    '/login',
    '/register',
    '/forget-password',
    '/reset-password',
  ],
};
