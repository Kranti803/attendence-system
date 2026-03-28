import apiClient from '@/lib/axios';
import { LoginCredentials, LoginResponse, AuthUser } from '@/types/auth';
import { ApiResponse } from '@/types/apiResponse';

//login function
export const loginFn = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/login/', credentials);

  // Also proactively set tokens into local storage here for good measure
  const accessToken = response.data?.data?.access;
  const refreshToken = response.data?.data?.refresh;

  if (typeof window !== 'undefined') {
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  }

  return response.data.data;
};

//getting the user profile
export const getProfileFn = async (): Promise<AuthUser> => {
  const response = await apiClient.get<ApiResponse<AuthUser>>('/profile/');
  return response.data.data;
};

//logout function
export const logoutFn = async (): Promise<void> => {
  const response = await apiClient.post('/logout/');
  return response.data;
};

