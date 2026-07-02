import apiClient from '@/lib/axios';
import {
  ClassSessionTemplate,
  CreateClassSessionTemplatePayload,
  UpdateClassSessionTemplatePayload,
} from '@/types/classSessionTemplate';
import { ApiResponse } from '@/types/apiResponse';

export const getAllTemplatesFn = async (): Promise<ClassSessionTemplate[]> => {
  const response = await apiClient.get<ApiResponse<ClassSessionTemplate[]>>('/class-session-templates/');
  return response.data.data;
};

export const getTemplateByIdFn = async (id: string): Promise<ClassSessionTemplate> => {
  const response = await apiClient.get<ApiResponse<ClassSessionTemplate>>(`/class-session-templates/${id}/`);
  return response.data.data;
};

export const createTemplateFn = async (
  payload: CreateClassSessionTemplatePayload
): Promise<ClassSessionTemplate> => {
  const response = await apiClient.post<ApiResponse<ClassSessionTemplate>>(
    '/class-session-templates/',
    payload
  );
  return response.data.data;
};

export const updateTemplateFn = async (
  id: string,
  payload: UpdateClassSessionTemplatePayload
): Promise<ClassSessionTemplate> => {
  const response = await apiClient.patch<ApiResponse<ClassSessionTemplate>>(
    `/class-session-templates/${id}/`,
    payload
  );
  return response.data.data;
};

export const deleteTemplateFn = async (id: string): Promise<void> => {
  await apiClient.delete(`/class-session-templates/${id}/`);
};

export const getMyTemplatesFn = async (): Promise<ClassSessionTemplate[]> => {
  const response = await apiClient.get<ApiResponse<ClassSessionTemplate[]>>(
    '/class-session-templates/my_templates/'
  );
  return response.data.data;
};

export const getTodaysSessionsFn = async (): Promise<ClassSessionTemplate[]> => {
  const response = await apiClient.get<ApiResponse<ClassSessionTemplate[]>>(
    '/class-session-templates/todays_sessions/'
  );
  return response.data.data;
};
