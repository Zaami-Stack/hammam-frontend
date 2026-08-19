import axios, { AxiosError } from 'axios';
import { ApiError } from '../types';

const baseURL = (import.meta.env.VITE_API_URL as string | undefined) || '/api';

const http = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

interface ErrorBody {
  success?: boolean;
  message?: string;
  code?: string;
}

function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorBody>;
    if (axiosError.response?.data?.message) {
      return {
        success: false,
        message: axiosError.response.data.message,
        code: axiosError.response.data.code,
        status: axiosError.response.status,
      };
    }
    if (axiosError.code === 'ECONNABORTED') {
      return { success: false, message: 'The request timed out. Please try again.' };
    }
    if (!axiosError.response) {
      return { success: false, message: 'Unable to reach the server. Please try again.' };
    }
    return {
      success: false,
      message: `Request failed (${axiosError.response.status})`,
      status: axiosError.response.status,
    };
  }
  if (error instanceof Error) {
    return { success: false, message: error.message };
  }
  return { success: false, message: 'An unexpected error occurred.' };
}

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error))
);

export { http, toApiError };
export type { ApiError };