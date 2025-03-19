import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Custom middleware to handle authentication checks
 * Uses cookies instead of next-auth's JWT
 */
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = 
    path === '/auth/login' || 
    path === '/auth/register'

  // Check if the path is dashboard or dashboard-related
  const isDashboardPath = path === '/dashboard' || path.startsWith('/dashboard/')
  
  // If it's not a public or dashboard path, let the request proceed
  if (!isPublicPath && !isDashboardPath) {
    return NextResponse.next()
  }

  // Check for auth cookie
  const authToken = request.cookies.get('auth_token')?.value
  
  // Check if the user is authenticated
  const isAuthenticated = !!authToken
  
  // If the path is public and the user is authenticated, redirect to dashboard
  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // If the path is dashboard and the user is not authenticated, redirect to login
  if (isDashboardPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  // Allow the request to continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 