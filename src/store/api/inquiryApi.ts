import { baseApi } from './baseApi';

export const inquiryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllInquiriesAdmin: builder.query({
      query: () => '/inquiries/admin/all',
      providesTags: ['Inquiries'],
    }),
    createInquiry: builder.mutation({
      query: (data: any) => ({
        url: '/inquiries',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Inquiries'],
    }),
    updateInquiryStatusAdmin: builder.mutation({
      query: ({ id, status }: { id: string; status: string }) => ({
        url: `/inquiries/${id}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: ['Inquiries'],
    }),
  }),
});

export const {
  useGetAllInquiriesAdminQuery,
  useCreateInquiryMutation,
  useUpdateInquiryStatusAdminMutation,
} = inquiryApi;
