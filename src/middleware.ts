import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const { pathname } = request.nextUrl

  // Protect /board and all sub-paths
  if (pathname.startsWith('/board') && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect already-authenticated users away from login
  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/board', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/board/:path*', '/login'],
}
