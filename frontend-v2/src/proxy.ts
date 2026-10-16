import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APP_PATHS, ADMIN_PATHS, COOKIE_NAMES } from "@/constants";
import { Role } from "@/enums";

const PUBLIC_PATHS = [
  APP_PATHS.HOME,
  APP_PATHS.LOGIN,
  APP_PATHS.SIGN_UP,
  APP_PATHS.FORGOT_PASSWORD,
  APP_PATHS.RESET_PASSWORD,
  APP_PATHS.VERIFY_OTP,
  APP_PATHS.UNAUTHORIZED,
  APP_PATHS.FORBIDDEN,
] as const;

const AUTH_ROUTES = [
  APP_PATHS.LOGIN,
  APP_PATHS.SIGN_UP,
  APP_PATHS.FORGOT_PASSWORD,
  APP_PATHS.RESET_PASSWORD,
] as const;

const VERIFICATION_CALLBACK_PATHS = [APP_PATHS.VERIFY_OTP] as const;

const isPublicPath = (pathname: string): boolean =>
  PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

const isAuthRoute = (pathname: string): boolean =>
  AUTH_ROUTES.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

const isVerificationCallbackPath = (pathname: string): boolean =>
  VERIFICATION_CALLBACK_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract authentication tokens and role from cookies
  const accessToken = request.cookies.get(COOKIE_NAMES.access)?.value;
  const refreshToken = request.cookies.get(COOKIE_NAMES.refresh)?.value;
  const role = request.cookies.get(COOKIE_NAMES.role)?.value as
    | Role
    | undefined;

  const hasSession = Boolean(accessToken || refreshToken);

  // Allow Next.js internal API proxy and route handlers to manage their own auth responses
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Handle public routes
  if (isPublicPath(pathname)) {
    const isCallback = isVerificationCallbackPath(pathname);

    // If user already has an active session and attempts to view login / sign-up / password recovery,
    // redirect them to their dashboard
    if (hasSession && isAuthRoute(pathname) && !isCallback) {
      return NextResponse.redirect(new URL(APP_PATHS.DASHBOARD, request.url));
    }

    return NextResponse.next();
  }

  // Protected route: Redirect unauthenticated users to login (with return URL)
  if (!hasSession) {
    const loginUrl = new URL(APP_PATHS.LOGIN, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin route guard: Check if route requires ADMIN privileges
  const isAdminPath = ADMIN_PATHS.some((path) => pathname.startsWith(path));
  if (isAdminPath && role !== Role.ADMIN) {
    return NextResponse.redirect(new URL(APP_PATHS.FORBIDDEN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
