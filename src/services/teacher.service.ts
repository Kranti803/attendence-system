import apiClient from '@/lib/axios';
import { CreateTeacherPayload, Teacher } from '@/types/teacher';
import { ApiResponse } from '@/types/apiResponse';

export const createTeacherFn = async (payload: CreateTeacherPayload): Promise<Teacher> => {
  const response = await apiClient.post<ApiResponse<Teacher>>('/teachers/', payload);
  return response.data.data;
};
