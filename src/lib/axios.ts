import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://attendance-backend-d3vk.onrender.com/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper functions for token management
const getAccessToken = () => (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);
const getRefreshToken = () => (typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null);
const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
};
const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Prevent retry loop if refresh token endpoint or login endpoint fails
    if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/login/')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Request a new access token (using pure axios to avoid interceptor loop)
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = response.data?.accessToken || response.data?.data?.accessToken;
        const newRefreshToken = response.data?.refreshToken || response.data?.data?.refreshToken;

        if (newAccessToken && newRefreshToken) {
          setTokens(newAccessToken, newRefreshToken);
        } else if (newAccessToken) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', newAccessToken);
          }
        }

        // Apply new token to the original request
        if (originalRequest.headers && newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Clear token and force re-login if refresh fails
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login'; // Adjust to your login route
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
