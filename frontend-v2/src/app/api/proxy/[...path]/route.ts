import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BASE_API_URL, COOKIE_NAMES } from "@/constants";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ path: string[] }> };

const HOP_BY_HOP_RESPONSE_HEADERS = [
  "content-encoding",
  "content-length",
  "transfer-encoding",
  "connection",
  "set-cookie",
];

const PUBLIC_API_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/verify",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/resend-otp",
  "/auth/logout",
];

const isPublicRoute = (normalizedPath: string) =>
  PUBLIC_API_ROUTES.some(
    (route) =>
      normalizedPath === route || normalizedPath.startsWith(`${route}/`),
  );

async function handler(req: NextRequest, { params }: Ctx) {
  const { path } = await params;

  // Prevent escaping the API prefix
  if (path.some((segment) => segment === "." || segment === "..")) {
    return NextResponse.json(
      { success: false, statusCode: 400, message: "Invalid path" },
      { status: 400 },
    );
  }

  const normalizedPath = `/${path.join("/")}`;
  const isPublic = isPublicRoute(normalizedPath);

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAMES.access)?.value;
  const refreshToken = cookieStore.get(COOKIE_NAMES.refresh)?.value;

  // Protected route and access cookie missing: return 401 to let client trigger refresh
  if (!isPublic && !accessToken) {
    return NextResponse.json(
      { success: false, statusCode: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const cookieHeader = [
    accessToken ? `access_token=${accessToken}` : null,
    refreshToken ? `refresh_token=${refreshToken}` : null,
  ]
    .filter(Boolean)
    .join("; ");

  const headers = new Headers();
  if (cookieHeader) {
    headers.set("Cookie", cookieHeader);
  }

  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const accept = req.headers.get("accept");
  if (accept) headers.set("accept", accept);

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const baseUrl = (BASE_API_URL || "").replace(/\/+$/, "");
  const targetUrl = `${baseUrl}/${path.join("/")}${req.nextUrl.search}`;

  let backendRes: Response;
  try {
    backendRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: hasBody ? await req.arrayBuffer() : undefined,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { success: false, statusCode: 502, message: "API unreachable" },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers(backendRes.headers);
  HOP_BY_HOP_RESPONSE_HEADERS.forEach((h) => responseHeaders.delete(h));

  return new NextResponse(backendRes.body, {
    status: backendRes.status,
    headers: responseHeaders,
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
