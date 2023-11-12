import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { TK } from '@/app/constants';

export function middleware(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/collections/:path*',
    '/excerpts/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/users/:path*',
  ],
};

function isAuthenticated(request: NextRequest) {
  return request.cookies.has(TK);
}
