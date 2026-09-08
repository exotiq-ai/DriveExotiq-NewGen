import { NextRequest, NextResponse } from 'next/server';
import { isPreview } from '@/lib/preview';

export function middleware(request: NextRequest) {
  const isAdmin = request.nextUrl.pathname === '/admin' || request.nextUrl.pathname.startsWith('/admin/');
  const response = isPreview && isAdmin
    ? new NextResponse('Not found', { status: 404 })
    : NextResponse.next();

  if (isPreview) response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

// Apply to documents, APIs, metadata, and assets in the isolated preview.
export const config = { matcher: '/:path*' };
