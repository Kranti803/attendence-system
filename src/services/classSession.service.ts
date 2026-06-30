import apiClient from '@/lib/axios';
import {
  ClassSession,
  CreateClassSessionPayload,
  UpdateClassSessionPayload,
} from '@/types/classSession';
import { ApiResponse } from '@/types/apiResponse';

export const getAllClassSessionsFn = async (): Promise<ClassSession[]> => {
  const response = await apiClient.get<ApiResponse<ClassSession[]>>('/class-sessions/');
  return response.data.data;
};

export const getClassSessionByIdFn = async (id: string): Promise<ClassSession> => {
  const response = await apiClient.get<ApiResponse<ClassSession>>(`/class-sessions/${id}/`);
  return response.data.data;
};

export const createClassSessionFn = async (
  payload: CreateClassSessionPayload
): Promise<ClassSession> => {
  // API accepts application/json for class-sessions (per Swagger schema)
  const response = await apiClient.post<ApiResponse<ClassSession>>('/class-sessions/', payload);
  return response.data.data;
};

export const updateClassSessionFn = async (
  id: string,
  payload: UpdateClassSessionPayload
): Promise<ClassSession> => {
  const response = await apiClient.patch<ApiResponse<ClassSession>>(
    `/class-sessions/${id}/`,
    payload
  );
  return response.data.data;
};

export const deleteClassSessionFn = async (id: string): Promise<void> => {
  await apiClient.delete(`/class-sessions/${id}/`);
};
