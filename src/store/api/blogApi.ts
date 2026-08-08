import { baseApi } from './baseApi';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  metaTitle?: string;
  metaDesc?: string;
  keywords?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPostInput {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  metaTitle?: string;
  metaDesc?: string;
  keywords?: string;
  isPublished?: boolean;
}

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogPosts: builder.query<BlogPost[], void>({
      query: () => '/blog',
      providesTags: ['Blog'],
    }),
    getBlogPostBySlug: builder.query<BlogPost, string>({
      query: (slug) => `/blog/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Blog', id: slug }],
    }),
    createBlogPost: builder.mutation<BlogPost, CreateBlogPostInput>({
      query: (data) => ({
        url: '/blog',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Blog'],
    }),
    updateBlogPost: builder.mutation<BlogPost, { id: string; data: Partial<CreateBlogPostInput> }>({
      query: ({ id, data }) => ({
        url: `/blog/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Blog'],
    }),
    deleteBlogPost: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/blog/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),
    uploadBlogImage: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: '/blog/upload-image',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetBlogPostsQuery,
  useGetBlogPostBySlugQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
  useUploadBlogImageMutation,
} = blogApi;
