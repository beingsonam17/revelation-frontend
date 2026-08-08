import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation({
      query: (userData: { email: string; password: string; fullName?: string; phone?: string }) => ({
        url: '/auth/register',
        method: 'POST',
        data: userData,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data: { email: string; code: string }) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Auth'],
    }),
    resendOtp: builder.mutation({
      query: (data: { email: string }) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data: { email: string }) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data: { email: string; code: string; password: string }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        data,
      }),
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    logoutApi: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    getMe: builder.query({
      query: () => '/auth/me',
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
