import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfileFn, loginFn, logoutFn } from '@/services/auth.service';
import { AuthUser, LoginCredentials, LoginResponse } from '@/types/auth';
import { deleteCookie } from '@/utils/cookie';

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => loginFn(credentials),
  });
};

export const useProfile = (enabled: boolean = true) => {
  return useQuery<AuthUser, Error>({
    queryKey: ['profile'],
    queryFn: getProfileFn,
    enabled,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: logoutFn,
    onSettled: () => {
      // Clear tokens regardless of whether API call succeeded
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        deleteCookie('role');
      }
      // Clear cached profile data
      queryClient.removeQueries({ queryKey: ['profile'] });
    },
  });
};
