import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import {
  APP_PATHS,
  AUTH_REFRESH_ROUTE,
  PROXY_BASE_URL,
  endpoint,
} from "@/constants";
import { clearSession } from "@/server/auth-session";
import { sessionExpired } from "./slices/sessionActions";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: PROXY_BASE_URL,
  credentials: "same-origin",
});

/**
 * Single-flight refresh: concurrent 401s share ONE refresh request
 * instead of each firing their own.
 */
let refreshPromise: Promise<boolean> | null = null;

const refreshSession = (): Promise<boolean> => {
  if (!refreshPromise) {
    refreshPromise = fetch(AUTH_REFRESH_ROUTE, {
      method: "POST",
      credentials: "same-origin",
    })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

// A 401 from these endpoints is a real auth failure, not an expired session
const AUTH_PATHS: string[] = Object.values(endpoint.auth);

const isAuthEndpoint = (url: string) =>
  AUTH_PATHS.some((path) => url === path || url.startsWith(`${path}?`));

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const url = typeof args === "string" ? args : args.url;

  if (result.error?.status === 401 && !isAuthEndpoint(url)) {
    const refreshed = await refreshSession();

    if (refreshed) {
      // Retry the original request once with the new cookies
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      await clearSession();
      api.dispatch(sessionExpired());

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== APP_PATHS.LOGIN
      ) {
        window.location.assign(APP_PATHS.LOGIN);
      }
    }
  }

  return result;
};
