import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProfile: builder.mutation({
      query: () => ({
        url: '/profiles/',
      }),
    }),
    postProfile: builder.mutation({
      query: (credentials) => ({
        url: '/profiles/',
        method: 'POST',
        body: credentials,
      }),
    }),
    updateProfile: builder.mutation({
      query: (credentials) => ({
        url: '/profiles/',
        method: 'PATCH',
        body: credentials,
      }),
    }),
  }),
});

export const {
  useGetProfileMutation,
  usePostProfileMutation,
  useUpdateProfileMutation,
} = profileApi;
