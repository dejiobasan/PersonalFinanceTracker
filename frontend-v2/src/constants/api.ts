export const BASE_API_URL = process.env.API_BASE_URL!;

export const PROXY_BASE_URL = "/api/proxy";
export const AUTH_REFRESH_ROUTE = "/api/auth/refresh";

export const COOKIE_NAMES = {
  role: "_ar",
  access: "_at",
  refresh: "_rt",
} as const;

export const endpoint = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
};
