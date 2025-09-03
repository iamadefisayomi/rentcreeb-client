import { NextRequest, NextResponse } from 'next/server';
import { headers } from "next/headers";
import { auth } from '@/auth';

export default async function middleware(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const path = req.nextUrl.pathname;

  if (session && (path.includes('signup') || path.includes('signin'))) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!session && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  const isAgent = session?.user.role === 'agent';

  if (!isAgent && path.includes('/tools')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (session && path.startsWith('/signin')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  runtime: "nodejs",
};
