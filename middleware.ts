import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access')?.value;

  if (request.nextUrl.pathname.startsWith('/dashboard') && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
