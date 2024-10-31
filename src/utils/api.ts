import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth'; // Import the auth store

export const API_BASE_URL = import.meta.env.VITE_API_URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  const token = authStore.token;

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export async function apiRequest<T>(method: string, url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
export function handleApiError(error: unknown): string[] {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      return ['Truy cập không được ủy quyền. Vui lòng đăng nhập lại.'];
    }
    if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
      const responseData = axiosError.response.data as any;
      console.log('Response Data:', responseData);

      if (responseData) {
        return Object.entries(responseData)
          .flatMap(([key, value]) => {
            if (Array.isArray(value)) {
              return value;
            }
            return `${key}: ${value}`;
          });
      } else if (responseData.message) {
        return [responseData.message];
      }
    }
    return [axiosError.message || 'Đã xảy ra lỗi khi gửi yêu cầu'];
  }
  return ['Đã xảy ra lỗi không mong đợi'];
}

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => apiRequest<T>('get', url, undefined, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => apiRequest<T>('post', url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => apiRequest<T>('put', url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => apiRequest<T>('delete', url, undefined, config),
};