export const APP_PATHS = {
  HOME: "/",
  LOGIN: "/login",
  SIGN_UP: "/sign-up",
};

export const MAX_COOKIES_AGE = 3600 * 24;
export const ACCESS_TOKEN_AGE = 15 * 60 * 1000;
export const REFRESH_TOKEN_AGE = 7 * 24 * 60 * 60 * 1000;

/** Next.js `cookies().set({ maxAge })` expects seconds, not milliseconds */
export const ACCESS_TOKEN_AGE_SECONDS = ACCESS_TOKEN_AGE / 1000;
export const REFRESH_TOKEN_AGE_SECONDS = REFRESH_TOKEN_AGE / 1000;
