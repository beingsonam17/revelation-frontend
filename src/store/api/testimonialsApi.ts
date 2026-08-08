import { baseApi } from './baseApi';

export interface Testimonial {
  id: string;
  name: string;
  email: string;
  rating: number;
  roleOrLocation?: string | null;
  serviceTitle?: string | null;
  title?: string | null;
  comment: string;
  isApproved: boolean;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  category: string;
  logoUrl?: string | null;
  description?: string | null;
  isActive: boolean;
}

export interface CreateTestimonialDto {
  name: string;
  email: string;
  rating: number;
  roleOrLocation?: string;
  serviceTitle?: string;
  title?: string;
  comment: string;
}

export const testimonialsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getApprovedTestimonials: builder.query<Testimonial[], void>({
      query: () => '/testimonials',
      providesTags: ['Testimonial'],
      transformResponse: (response: any) => response.data || response,
    }),
    getAdminTestimonials: builder.query<Testimonial[], void>({
      query: () => '/testimonials/admin/all',
      providesTags: ['Testimonial'],
      transformResponse: (response: any) => response.data || response,
    }),
    createTestimonial: builder.mutation<Testimonial, CreateTestimonialDto>({
      query: (data) => ({
        url: '/testimonials',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Testimonial'],
    }),
    toggleApproveTestimonial: builder.mutation<Testimonial, string>({
      query: (id) => ({
        url: `/testimonials/admin/${id}/toggle-approve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Testimonial'],
    }),
    deleteTestimonial: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/testimonials/admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Testimonial'],
    }),
    getClients: builder.query<Client[], void>({
      query: () => '/clients',
      providesTags: ['Client'],
      transformResponse: (response: any) => response.data || response,
    }),
  }),
});

export const {
  useGetApprovedTestimonialsQuery,
  useGetAdminTestimonialsQuery,
  useCreateTestimonialMutation,
  useToggleApproveTestimonialMutation,
  useDeleteTestimonialMutation,
  useGetClientsQuery,
} = testimonialsApi;
