import { baseApi } from './baseApi';

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyBookings: builder.query({
      query: () => '/bookings/my-bookings',
      providesTags: ['Bookings'],
    }),
    getAllBookingsAdmin: builder.query({
      query: (status?: string) => ({
        url: '/bookings/admin/all',
        params: status ? { status } : undefined,
      }),
      providesTags: ['Bookings'],
    }),
    createBooking: builder.mutation({
      query: (data: any) => ({
        url: '/bookings',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Bookings'],
    }),
    updateBookingStatusAdmin: builder.mutation({
      query: ({ id, status }: { id: string; status: string }) => ({
        url: `/bookings/${id}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: ['Bookings'],
    }),
  }),
});

export const {
  useGetMyBookingsQuery,
  useGetAllBookingsAdminQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusAdminMutation,
} = bookingApi;
