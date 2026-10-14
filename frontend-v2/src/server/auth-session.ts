"use server";

import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_AGE_SECONDS,
  REFRESH_TOKEN_AGE_SECONDS,
  COOKIE_NAMES,
} from "@/constants";

export async function setSecureSession(
  role: string,
  access_token: string,
  refresh_token: string,
) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAMES.role, role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ACCESS_TOKEN_AGE_SECONDS,
  });
  cookieStore.set(COOKIE_NAMES.access, access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ACCESS_TOKEN_AGE_SECONDS,
  });
  cookieStore.set(COOKIE_NAMES.refresh, refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: REFRESH_TOKEN_AGE_SECONDS,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAMES.role);
  cookieStore.delete(COOKIE_NAMES.access);
  cookieStore.delete(COOKIE_NAMES.refresh);
}
