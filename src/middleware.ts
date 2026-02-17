import { NextRequest, NextResponse } from "next/server";
import {
  ignoredRoutePatterns,
  protectedRoutePatterns,
} from "./middleware.config";
import { AUTH_COOKIES } from "@/modules/auth/common/auth.constants";
import { jwtVerify } from "jose";

const isRouteMatching = (pathname: string, patterns: RegExp[]) =>
  patterns.some((pattern) => pattern.test(pathname));

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

async function verifyToken(token: string) {
  const secret = getJwtSecret();
  if (!secret) return null;
  const { payload } = await jwtVerify(token, secret);
  return payload as { user?: { roles?: string[] } };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isRouteMatching(pathname, ignoredRoutePatterns)) {
    return NextResponse.next();
  }

  const requiresAuth = isRouteMatching(pathname, protectedRoutePatterns);
  const authToken = request.cookies.get(AUTH_COOKIES.token)?.value ?? null;

  try {
    const payload = authToken ? await verifyToken(authToken) : null;
    const isAuthenticated = !!payload?.user;

    // NotAuthenticatedRoute: si ya tiene sesion, fuera de /auth/*
    if (pathname.startsWith("/auth") && isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    if (!requiresAuth) return NextResponse.next();

    if (!isAuthenticated) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/auth/login";
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const isAdminRoute = pathname.startsWith("/admin");
    if (isAdminRoute) {
      const roles = payload.user?.roles ?? [];
      if (!roles.includes("admin")) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  } catch {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(AUTH_COOKIES.token);
    response.cookies.delete(AUTH_COOKIES.role);
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
