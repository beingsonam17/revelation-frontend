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
  useGetMeQuery,
} = authApi;
