import type { IApiService } from "./api";

export type AuthSession = IApiService["schemas"]["AuthSessionDataDto"];

/** Session data minus the httpOnly-cookie tokens */
export type AuthUser = Omit<AuthSession, "accessToken" | "refreshToken">;
