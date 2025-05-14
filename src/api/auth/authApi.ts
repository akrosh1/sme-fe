import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
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
    // login: builder.mutation({
    //   query: (credentials) => ({
    //     url: '/auth/token/',
    //     method: 'POST',
    //     body: credentials,
    //   }),
    // }),
    register: builder.mutation({
      query: (credentials) => ({
        url: '/profiles/',
        method: 'POST',
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (credentials) => ({
        url: '/users/request-reset-password/',
        method: 'POST',
        body: credentials,
      }),
    }),
    resetPassword: builder.mutation({
      query: (credentials) => ({
        url: '/users/update-password/',
        method: 'PATCH',
        body: credentials,
      }),
    }),
    getUser: builder.query({
      query: () => '/auth/me',
    }),
  }),
});

export const {
  // useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetUserQuery,
} = authApi;
