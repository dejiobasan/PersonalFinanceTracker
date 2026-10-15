export const BASE_API_URL = process.env.API_BASE_URL!;

export const PROXY_BASE_URL = "/api/proxy";
export const AUTH_REFRESH_ROUTE = "/api/auth/refresh";

export const COOKIE_NAMES = {
  role: "_ar",
  access: "_at",
  refresh: "_rt",
} as const;

export const REQUEST_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  HEAD: "HEAD",
  OPTIONS: "OPTIONS",
  TRACE: "TRACE",
  CONNECT: "CONNECT",
};

export const endpoints = {
  auth: {
    register: "/auth/register",
    verify: "/auth/verify",
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    resendOtp: "/auth/resend-otp",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
};
