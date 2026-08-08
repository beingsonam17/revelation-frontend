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

      let url = '';
      let method: AxiosRequestConfig['method'] = 'GET';
      let data: AxiosRequestConfig['data'] = undefined;
      let params: AxiosRequestConfig['params'] = undefined;
      let headers: AxiosRequestConfig['headers'] = {};

      if (typeof arg === 'string') {
        url = arg;
      } else if (arg && typeof arg === 'object' && 'url' in arg) {
        url = arg.url;
        method = arg.method || 'GET';
        data = arg.data !== undefined ? arg.data : (arg as any).body;
        params = arg.params;
        headers = arg.headers || {};
      }

      const requestHeaders = { ...headers };
      if (token) {
        requestHeaders['authorization'] = `Bearer ${token}`;
      }

      const result = await axiosClient({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: requestHeaders,
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: (err.response?.data as any)?.message || err.message,
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
