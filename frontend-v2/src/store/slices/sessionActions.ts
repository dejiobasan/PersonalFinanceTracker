import { createAction } from "@reduxjs/toolkit";

/**
 * Dispatched when the refresh token is no longer valid.
 * Kept in its own file to avoid a store <-> apiSlice <-> baseQuery import cycle.
 */
export const sessionExpired = createAction("auth/sessionExpired");
