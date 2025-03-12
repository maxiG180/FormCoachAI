// Note: This is just a stub for the middleware
// In a real Next.js app, this would need server-side authentication checking
// Since Firebase auth is client-side, we're handling auth protection in the component

import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // We're not doing server-side auth here because Firebase auth is client-side
  // The actual protection is handled by the ProtectedRoute component
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  // You could specify protected routes here if needed
  // matcher: ['/dashboard/:path*', '/analyze/:path*'],
}