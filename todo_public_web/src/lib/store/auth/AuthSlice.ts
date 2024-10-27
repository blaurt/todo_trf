import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosRtkAdapter } from '../../utils/http-client';
import { UserType } from './user.types';

interface LoginResponse {
  user: UserType;
  access_token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosRtkAdapter(),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials,
      }),
    }),
    signup: builder.mutation<void, SignupPayload>({
      query: (credentials) => {
        const { confirmPassword: repeatPassword, ...rest } = credentials;
        return {
          url: '/auth/signup',
          method: 'POST',
          data: { ...rest, repeatPassword },
        };
      },
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;
export default authApi;
