import apiClient from '@/lib/axios';
import { CreateTeacherPayload, UpdateTeacherPayload, Teacher } from '@/types/teacher';
import { ApiResponse } from '@/types/apiResponse';

export const getAllTeachersFn = async (): Promise<Teacher[]> => {
  const response = await apiClient.get<ApiResponse<Teacher[]>>('/teachers/');
  return response.data.data;
};

export const createTeacherFn = async (payload: CreateTeacherPayload): Promise<Teacher> => {
  const form = new FormData();
  (Object.keys(payload) as (keyof CreateTeacherPayload)[]).forEach((key) => {
    const value = payload[key];
    if (value !== null && value !== undefined && value !== '') {
      form.append(key, String(value));
    }
  });
  const response = await apiClient.post<ApiResponse<Teacher>>('/teachers/', form);
  return response.data.data;
};

export const updateTeacherFn = async (id: string, payload: UpdateTeacherPayload): Promise<Teacher> => {
  const form = new FormData();
  (Object.keys(payload) as (keyof UpdateTeacherPayload)[]).forEach((key) => {
    const value = payload[key];
    if (value !== null && value !== undefined && value !== '') {
      form.append(key, String(value));
    }
  });
  const response = await apiClient.patch<ApiResponse<Teacher>>(`/teachers/${id}/`, form);
  return response.data.data;
};

export const deleteTeacherFn = async (id: string): Promise<void> => {
  await apiClient.delete(`/teachers/${id}/`);
};
