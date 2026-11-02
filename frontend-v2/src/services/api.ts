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
    getAllUsers: builder.query<
      IApiService["schemas"]["UsersListResponseDto"],
      IApiServiceOperations["getAllUsers"]["parameters"]["query"] | void
    >({
      query: (params) => ({
        url: endpoints.users.getAll,
        method: REQUEST_METHODS.GET,
        params: params
          ? {
              ...(params.page ? { page: params.page } : {}),
              ...(params.limit ? { limit: params.limit } : {}),
              ...(params.name?.trim() ? { name: params.name.trim() } : {}),
            }
          : undefined,
      }),
      transformResponse: (
        response: IApiService["schemas"]["UsersListResponseDto"],
      ) => response,
      providesTags: ["Users"],
    }),
    deleteUser: builder.mutation<
      IApiService["schemas"]["DeleteUserResponseDto"],
      string
    >({
      query: (id) => ({
        url: endpoints.users.deleteById(id),
        method: REQUEST_METHODS.DELETE,
      }),
      transformResponse: (
        response: IApiService["schemas"]["DeleteUserResponseDto"],
      ) => response,
      invalidatesTags: ["Users", "AdminAnalytics", "Transactions"],
    }),
    getAdminAnalytics: builder.query<
      IApiService["schemas"]["AdminAnalyticsResponseDto"],
      void
    >({
      query: () => ({
        url: endpoints.analytics.admin,
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: IApiService["schemas"]["AdminAnalyticsResponseDto"],
      ) => response,
      providesTags: ["AdminAnalytics"],
    }),
    getAllTransactions: builder.query<
      IApiService["schemas"]["TransactionListResponseDto"],
      IApiServiceOperations["getAllTransactions"]["parameters"]["query"] | void
    >({
      query: (params) => ({
        url: endpoints.transactions.admin,
        method: REQUEST_METHODS.GET,
        params: params
          ? {
              ...(params.page ? { page: params.page } : {}),
              ...(params.limit ? { limit: params.limit } : {}),
              ...(params.type ? { type: params.type } : {}),
              ...(params.name?.trim() ? { name: params.name.trim() } : {}),
            }
          : undefined,
      }),
      transformResponse: (
        response: IApiService["schemas"]["TransactionListResponseDto"],
      ) => response,
      providesTags: ["Transactions"],
    }),
    deleteAllTransactions: builder.mutation<
      IApiService["schemas"]["DeleteAllTransactionsResponseDto"],
      void
    >({
      query: () => ({
        url: endpoints.transactions.admin,
        method: REQUEST_METHODS.DELETE,
      }),
      transformResponse: (
        response: IApiService["schemas"]["DeleteAllTransactionsResponseDto"],
      ) => response,
      invalidatesTags: [
        "Transactions",
        "AdminAnalytics",
        "UserAnalytics",
        "Users",
      ],
    }),
    getUserAnalytics: builder.query<
      IApiService["schemas"]["UserAnalyticsResponseDto"],
      void
    >({
      query: () => ({
        url: endpoints.analytics.me,
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: IApiService["schemas"]["UserAnalyticsResponseDto"],
      ) => response,
      providesTags: ["UserAnalytics"],
    }),
    getUserTransactions: builder.query<
      IApiService["schemas"]["TransactionListResponseDto"],
      IApiServiceOperations["getUserTransactions"]["parameters"]["query"] | void
    >({
      query: (params) => ({
        url: endpoints.transactions.base,
        method: REQUEST_METHODS.GET,
        params: params
          ? {
              ...(params.page ? { page: params.page } : {}),
              ...(params.limit ? { limit: params.limit } : {}),
              ...(params.type ? { type: params.type } : {}),
            }
          : undefined,
      }),
      transformResponse: (
        response: IApiService["schemas"]["TransactionListResponseDto"],
      ) => response,
      providesTags: ["Transactions"],
    }),
    updateProfile: builder.mutation<
      IApiService["schemas"]["UpdateProfileResponseDto"],
      IApiService["schemas"]["UpdateProfileDto"]
    >({
      query: (body) => ({
        url: endpoints.users.updateMe,
        method: REQUEST_METHODS.PATCH,
        body,
      }),
      transformResponse: (
        response: IApiService["schemas"]["UpdateProfileResponseDto"],
      ) => response,
      invalidatesTags: ["Users"],
    }),
    changePassword: builder.mutation<
      IApiService["schemas"]["changePasswordResponseDto"],
      IApiService["schemas"]["changePasswordDto"]
    >({
      query: (body) => ({
        url: endpoints.auth.changePassword,
        method: REQUEST_METHODS.POST,
        body,
      }),
      transformResponse: (
        response: IApiService["schemas"]["changePasswordResponseDto"],
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
  useGetAllUsersQuery,
  useLazyGetAllUsersQuery,
  useDeleteUserMutation,
  useGetAdminAnalyticsQuery,
  useLazyGetAdminAnalyticsQuery,
  useGetAllTransactionsQuery,
  useLazyGetAllTransactionsQuery,
  useDeleteAllTransactionsMutation,
  useGetUserAnalyticsQuery,
  useLazyGetUserAnalyticsQuery,
  useGetUserTransactionsQuery,
  useLazyGetUserTransactionsQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = apiService;
