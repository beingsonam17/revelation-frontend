import { baseApi } from './baseApi';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: () => '/admin/dashboard/stats',
      providesTags: ['Bookings', 'Services', 'Inquiries'],
    }),
  }),
});

export const { useGetAdminStatsQuery } = dashboardApi;
