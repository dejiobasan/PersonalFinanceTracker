import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BASE_API_URL, COOKIE_NAMES, endpoint } from "@/constants";
import { clearSession, setSecureSession } from "@/server/auth-session";

export const dynamic = "force-dynamic";

interface RefreshEnvelope {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    role: string;
    accessToken: string;
    refreshToken: string;
    [key: string]: unknown;
  };
  timestamp?: string;
}

const unauthorized = (message: string) =>
  NextResponse.json(
    { success: false, statusCode: 401, message },
    { status: 401 },
  );

/**
 * Exchanges the httpOnly `_rt` cookie for a fresh access token.
 * New tokens are written back as httpOnly cookies and are never
 * returned to the browser.
 */
export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(COOKIE_NAMES.refresh)?.value;

  if (!refreshToken) return unauthorized("No refresh token");

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BASE_API_URL}${endpoint.auth.refresh}`, {
      method: "POST",
      headers: { Cookie: `refresh_token=${refreshToken}` },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { success: false, statusCode: 502, message: "Auth service unreachable" },
      { status: 502 },
    );
  }

  if (!backendRes.ok) {
    await clearSession();
    return unauthorized("Session expired");
  }

  const envelope = (await backendRes.json()) as RefreshEnvelope;
  const data = envelope.data;

  if (!data?.accessToken) {
    await clearSession();
    return unauthorized("Invalid refresh response");
  }

  await setSecureSession(
    data.role,
    data.accessToken,
    data.refreshToken ?? refreshToken,
  );

  // Strip tokens before handing the profile back to the browser
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { accessToken, refreshToken: _rt, ...profile } = data;

  return NextResponse.json({ ...envelope, data: profile }, { status: 200 });
}
