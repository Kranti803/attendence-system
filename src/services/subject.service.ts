import apiClient from '@/lib/axios';
import { CreateSubjectPayload, UpdateSubjectPayload, Subject } from '@/types/subject';
import { ApiResponse } from '@/types/apiResponse';

export const getAllSubjectsFn = async (): Promise<Subject[]> => {
  const response = await apiClient.get<ApiResponse<Subject[]>>('/subjects/');
  return response.data.data;
};

export const getSubjectByIdFn = async (id: string): Promise<Subject> => {
  const response = await apiClient.get<ApiResponse<Subject>>(`/subjects/${id}/`);
  return response.data.data;
};

export const createSubjectFn = async (payload: CreateSubjectPayload): Promise<Subject> => {
  const response = await apiClient.post<ApiResponse<Subject>>('/subjects/', payload);
  return response.data.data;
};

export const updateSubjectFn = async (id: string, payload: UpdateSubjectPayload): Promise<Subject> => {
  const response = await apiClient.patch<ApiResponse<Subject>>(`/subjects/${id}/`, payload);
  return response.data.data;
};

export const deleteSubjectFn = async (id: string): Promise<void> => {
  await apiClient.delete(`/subjects/${id}/`);
};
