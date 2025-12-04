import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

// Check if Clerk is configured
const isClerkConfigured = !!process.env.CLERK_SECRET_KEY && !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Create the Clerk middleware
const clerkMiddleware = authMiddleware({
  publicRoutes: [
    '/',
    '/login',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks(.*)',
    '/api/signup(.*)',
    '/api/enrollments(.*)',
    '/api/users(.*)',
  ],
});

// Export middleware - if Clerk is not configured, create a passthrough middleware
export default isClerkConfigured 
  ? clerkMiddleware
  : () => NextResponse.next();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

