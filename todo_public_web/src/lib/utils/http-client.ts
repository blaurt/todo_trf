import axios, { AxiosHeaders } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = window.localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

type IQueryParams = {
  url: string;
  data?: Record<string, any>;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  params?: Record<string, any>;
  headers?: AxiosHeaders;
};

export const axiosRtkAdapter =
  ({ baseUrl } = { baseUrl: API_BASE_URL }) =>
  async ({ url = '/', method = 'GET', data, params, headers }: IQueryParams) => {
    const result = await axiosInstance({
      url: baseUrl + url,
      method,
      data,
      params,
      headers,
    });
    return { data: result.data };
  };
