import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthSession, AuthUser } from "@/types";
import type { RootState } from "../store";

export type VerificationType = "email_verification" | "forgot_password";

export interface UserVerificationState {
  userVerificationEmail: string | null;
  userVerificationType: VerificationType | string | null;
  userVerificationOtp: string | null;
}

interface AuthState {
  user: AuthUser | null;
  userVerification: UserVerificationState;
}

const initialState: AuthState = {
  user: null,
  userVerification: {
    userVerificationEmail: null,
    userVerificationType: null,
    userVerificationOtp: null,
  },
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
    setUserVerification: (
      state,
      action: PayloadAction<{
        userVerificationEmail: string;
        userVerificationType: VerificationType | string;
        userVerificationOtp?: string | null;
      }>,
    ) => {
      state.userVerification = {
        userVerificationEmail: action.payload.userVerificationEmail,
        userVerificationType: action.payload.userVerificationType,
        userVerificationOtp: action.payload.userVerificationOtp ?? null,
      };
    },
    setUserVerificationOtp: (state, action: PayloadAction<string>) => {
      state.userVerification.userVerificationOtp = action.payload;
    },
    clearUserVerification: (state) => {
      state.userVerification = {
        userVerificationEmail: null,
        userVerificationType: null,
        userVerificationOtp: null,
      };
    },
    // Backwards-compatible shortcuts
    setUserVerificationEmail: (state, action: PayloadAction<string>) => {
      state.userVerification.userVerificationEmail = action.payload;
    },
    clearUserVerificationEmail: (state) => {
      state.userVerification.userVerificationEmail = null;
    },
  },
});

export const {
  setAuthUser,
  clearAuthUser,
  setUserVerification,
  setUserVerificationOtp,
  clearUserVerification,
  setUserVerificationEmail,
  clearUserVerificationEmail,
} = authSlice.actions;

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.user;
export const selectUserVerification = (state: RootState) =>
  state.auth.userVerification;
export const selectUserVerificationEmail = (state: RootState) =>
  state.auth.userVerification?.userVerificationEmail;
export const selectUserVerificationType = (state: RootState) =>
  state.auth.userVerification?.userVerificationType;
export const selectUserVerificationOtp = (state: RootState) =>
  state.auth.userVerification?.userVerificationOtp;

export default authSlice.reducer;
