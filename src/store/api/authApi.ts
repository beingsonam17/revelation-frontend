import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: '/api/v1/auth/login',
        method: 'POST',
        data: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation({
      query: (userData: { email: string; password: string; fullName?: string; phone?: string }) => ({
        url: '/api/v1/auth/register',
        method: 'POST',
        data: userData,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data: { email: string; code: string }) => ({
        url: '/api/v1/auth/verify-otp',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Auth'],
    }),
    resendOtp: builder.mutation({
      query: (data: { email: string }) => ({
        url: '/api/v1/auth/resend-otp',
        method: 'POST',
        data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data: { email: string }) => ({
        url: '/api/v1/auth/forgot-password',
        method: 'POST',
        data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data: { email: string; code: string; password: string }) => ({
        url: '/api/v1/auth/reset-password',
        method: 'POST',
        data,
      }),
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: '/api/v1/auth/refresh',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    logoutApi: builder.mutation({
      query: () => ({
        url: '/api/v1/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    getMe: builder.query({
      query: () => '/api/v1/auth/me',
      providesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useLogoutApiMutation,
  useGetMeQuery,
} = authApi;
