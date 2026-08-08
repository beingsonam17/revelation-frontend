import { baseApi } from './baseApi';

export const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query({
      query: (search?: string) => ({
        url: '/services',
        params: search ? { search } : undefined,
      }),
      providesTags: ['Services'],
    }),
    getServiceBySlug: builder.query({
      query: (slug: string) => `/services/${slug}`,
      providesTags: ['Services'],
    }),
    createServiceAdmin: builder.mutation({
      query: (data: any) => ({
        url: '/services',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Services'],
    }),
    updateServiceAdmin: builder.mutation({
      query: ({ id, ...data }: { id: string; [key: string]: any }) => ({
        url: `/services/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['Services'],
    }),
    deleteServiceAdmin: builder.mutation({
      query: (id: string) => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Services'],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceBySlugQuery,
  useCreateServiceAdminMutation,
  useUpdateServiceAdminMutation,
  useDeleteServiceAdminMutation,
} = servicesApi;
