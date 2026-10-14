import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthSession, AuthUser } from "@/types";
import type { RootState } from "../store";

interface AuthState {
  user: AuthUser | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: {
      reducer: (state, action: PayloadAction<AuthUser>) => {
        state.user = action.payload;
      },
      // Accepts the full login/refresh session object but never lets the
      // httpOnly-cookie tokens into the action (DevTools) or persisted state.
      prepare: (
        session: AuthUser &
          Partial<Pick<AuthSession, "accessToken" | "refreshToken">>,
      ) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { accessToken, refreshToken, ...user } = session;
        return { payload: user };
      },
    },
    clearAuthUser: (state) => {
      state.user = null;
    },
  },
});

export const { setAuthUser, clearAuthUser } = authSlice.actions;

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.user;

export default authSlice.reducer;
