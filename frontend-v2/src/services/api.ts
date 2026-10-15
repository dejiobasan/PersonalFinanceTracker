import { endpoints, REQUEST_METHODS } from "@/constants";
import { apiSlice } from "@/store";
import { IApiService, IApiServicePaths, IApiServiceOperations } from "@/types";

export const apiService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<
      IApiService["schemas"]["RegisterResponseDto"],
      IApiService["schemas"]["RegisterDto"]
    >({
      query: (body) => ({
        url: endpoints.auth.register,
        method: REQUEST_METHODS.POST,
        body,
      }),
      transformResponse: (
        response: IApiService["schemas"]["RegisterResponseDto"],
      ) => response,
    }),
    verifyUser: builder.mutation<
      IApiService["schemas"]["VerifyEmailResponseDto"],
      IApiService["schemas"]["verifyEmailDto"]
    >({
      query: (body) => ({
        url: endpoints.auth.verify,
        method: REQUEST_METHODS.POST,
        body,
      }),
      transformResponse: (
        response: IApiService["schemas"]["VerifyEmailResponseDto"],
      ) => response,
    }),
    resendOtp: builder.mutation<
      IApiService["schemas"]["ResendOtpResponseDto"],
      IApiService["schemas"]["ResendOtpDto"]
    >({
      query: (body) => ({
        url: endpoints.auth.resendOtp,
        method: REQUEST_METHODS.POST,
        body,
      }),
      transformResponse: (
        response: IApiService["schemas"]["ResendOtpResponseDto"],
      ) => response,
    }),
    forgotPassword: builder.mutation<
      IApiService["schemas"]["ForgotPasswordResponseDto"],
      IApiService["schemas"]["ForgotPasswordDto"]
    >({
      query: (body) => ({
        url: endpoints.auth.forgotPassword,
        method: REQUEST_METHODS.POST,
        body,
      }),
      transformResponse: (
        response: IApiService["schemas"]["ForgotPasswordResponseDto"],
      ) => response,
    }),
    resetPassword: builder.mutation<
      IApiService["schemas"]["ResetPasswordResponseDto"],
      IApiService["schemas"]["ResetPasswordDto"]
    >({
      query: (body) => ({
        url: endpoints.auth.resetPassword,
        method: REQUEST_METHODS.POST,
        body,
      }),
      transformResponse: (
        response: IApiService["schemas"]["ResetPasswordResponseDto"],
      ) => response,
    }),
    loginUser: builder.mutation<
      IApiService["schemas"]["LoginResponseDto"],
      IApiService["schemas"]["LoginDto"]
    >({
      query: (body) => ({
        url: endpoints.auth.login,
        method: REQUEST_METHODS.POST,
        body,
      }),
      transformResponse: (
        response: IApiService["schemas"]["LoginResponseDto"],
      ) => response,
    }),
    logoutUser: builder.mutation<
      IApiService["schemas"]["LogoutResponseDto"],
      void
    >({
      query: () => ({
        url: endpoints.auth.logout,
        method: REQUEST_METHODS.POST,
      }),
      transformResponse: (
        response: IApiService["schemas"]["LogoutResponseDto"],
      ) => response,
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useVerifyUserMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
} = apiService;
