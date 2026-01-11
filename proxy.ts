import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("session_id");
  const isLoggedIn = Boolean(session);
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const targetPath = isLoggedIn ? "/dashboard" : "/";
    return NextResponse.rewrite(new URL(targetPath, request.url));
  }
  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect logged in users away from Auth pages
  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect guests away from protected pages
  const isProtectedPage = pathname.startsWith("/dashboard");
  if (!isLoggedIn && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
