import { baseApi } from './baseApi';

export interface AdminUser {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminDto {
  email: string;
  password?: string;
  fullName?: string;
  phone?: string;
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdmins: builder.query<AdminUser[], void>({
      query: () => '/auth/admin/list',
      providesTags: ['Admin'],
      transformResponse: (response: any) => {
        // baseApi unwraps { success, data } — response is now the inner payload
        if (Array.isArray(response?.users)) return response.users;
        if (Array.isArray(response?.admins)) return response.admins;
        if (Array.isArray(response)) return response;
        return [];
      },
    }),
    getUsers: builder.query<AdminUser[], void>({
      query: () => '/auth/users',
      providesTags: ['Admin'],
      transformResponse: (response: any) => {
        // baseApi unwraps { success, data } — response is now the inner payload
        if (Array.isArray(response?.users)) return response.users;
        if (Array.isArray(response?.admins)) return response.admins;
        if (Array.isArray(response)) return response;
        return [];
      },
    }),
    createAdmin: builder.mutation<AdminUser, CreateAdminDto>({
      query: (data) => ({
        url: '/auth/admin/create',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Admin'],
    }),
    deleteAdmin: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/auth/admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admin'],
    }),
    toggleActiveAdmin: builder.mutation<AdminUser, string>({
      query: (id) => ({
        url: `/auth/admin/${id}/toggle-active`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Admin'],
    }),
    toggleUserActive: builder.mutation<AdminUser, string>({
      query: (id) => ({
        url: `/auth/users/${id}/toggle-active`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Admin'],
    }),
  }),
});

export const {
  useGetAdminsQuery,
  useGetUsersQuery,
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useToggleActiveAdminMutation,
  useToggleUserActiveMutation,
} = adminApi;
