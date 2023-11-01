import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { TK } from '@/app/constants';

export function middleware(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/collections/:path*', '/profile/:path*'],
};

function isAuthenticated(request: NextRequest) {
  return request.cookies.has(TK);
}
