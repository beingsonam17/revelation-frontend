import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import axiosClient from '@/lib/axios';
import { RootState } from '../index';

export const axiosBaseQuery = (
  { baseUrl }: { baseUrl: string } = { baseUrl: '' }
): BaseQueryFn<
  | string
  | {
      url: string;
      method?: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    },
  unknown,
  unknown
> =>
  async (arg, api) => {
    try {
      const state = api.getState() as RootState;
      const token = state.auth?.token;

      let rawUrl = '';
      let method: AxiosRequestConfig['method'] = 'GET';
      let data: AxiosRequestConfig['data'] = undefined;
      let params: AxiosRequestConfig['params'] = undefined;
      let headers: AxiosRequestConfig['headers'] = {};

      if (typeof arg === 'string') {
        rawUrl = arg;
      } else if (arg && typeof arg === 'object' && 'url' in arg) {
        rawUrl = arg.url;
        method = arg.method || 'GET';
        data = arg.data !== undefined ? arg.data : (arg as any).body;
        params = arg.params;
        headers = arg.headers || {};
      }

      // Automatically strip redundant /api/v1 prefix to prevent duplicate /api/v1/api/v1 URLs
      let cleanUrl = rawUrl;
      if (cleanUrl.startsWith('/api/v1')) {
        cleanUrl = cleanUrl.replace(/^\/api\/v1/, '');
      }

      const requestHeaders = { ...headers };
      if (token) {
        requestHeaders['authorization'] = `Bearer ${token}`;
      }

      const result = await axiosClient({
        url: baseUrl + cleanUrl,
        method,
        data,
        params,
        headers: requestHeaders,
      });

      const raw = result.data;

      // Auto-unwrap the global { success, message, data: <payload> } envelope
      // that every backend endpoint returns, so RTK Query receives the actual payload.
      let unwrapped = raw;
      if (
        raw &&
        typeof raw === 'object' &&
        'success' in raw &&
        'data' in raw
      ) {
        unwrapped = raw.data;
      }

      return { data: unwrapped };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      const responseData = err.response?.data as any;

      let userFacingError = responseData?.message || err.message || 'An unexpected error occurred.';

      // Format raw NestJS / Express 404 or routing errors into user-friendly messages
      if (typeof userFacingError === 'string' && (userFacingError.startsWith('Cannot POST') || userFacingError.startsWith('Cannot GET'))) {
        userFacingError = 'Service endpoint unavailable. Please try again.';
      }

      return {
        error: {
          status: err.response?.status,
          data: userFacingError,
        },
      };
    }
  };

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Auth', 'Bookings', 'Services', 'Blog', 'Inquiries', 'Admin', 'Testimonial', 'Client', 'SiteSettings'],
  endpoints: () => ({}),
});
