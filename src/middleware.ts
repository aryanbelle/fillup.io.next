import { clerkMiddleware, redirectToSignIn } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function handles route redirection for the renamed root directory
export function middleware(request: NextRequest) {
  // Handle redirects for routes that were previously under /(root)
  const path = request.nextUrl.pathname;
  
  // Redirect /dashboard to /root/dashboard
  if (path === '/dashboard') {
    return NextResponse.redirect(new URL('/root/dashboard', request.url));
  }
  
  // Redirect /myforms to /root/myforms
  if (path === '/myforms') {
    return NextResponse.redirect(new URL('/root/myforms', request.url));
  }
  
  // Redirect /newform to /root/newform
  if (path === '/newform') {
    return NextResponse.redirect(new URL('/root/newform', request.url));
  }
  
  // Redirect /ai to /root/ai
  if (path === '/ai') {
    return NextResponse.redirect(new URL('/root/ai', request.url));
  }
  
  // Redirect /settings to /root/settings
  if (path === '/settings') {
    return NextResponse.redirect(new URL('/root/settings', request.url));
  }
  
  // Redirect /security to /root/security
  if (path === '/security') {
    return NextResponse.redirect(new URL('/root/security', request.url));
  }
  
  // Apply Clerk middleware for authentication
  return clerkMiddleware()(request);
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
