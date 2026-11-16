import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// NextAuth route protection proxy (Next.js 16 convention)
// Automatically intercepts requests to protected routes and redirects unauthenticated visitors to /sign-in
export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/sign-in",
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
);

// Define which routes to protect (Tutorial timestamp 1:02:44)
export const config = {
  matcher: [
    "/workspace/:path*",
  ],
};
