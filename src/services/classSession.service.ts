import apiClient from '@/lib/axios';
import {
  ClassSession,
  CreateClassSessionPayload,
  UpdateClassSessionPayload,
} from '@/types/classSession';
import { ApiResponse } from '@/types/apiResponse';

export interface GetClassSessionsParams {
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const getAllClassSessionsFn = async (): Promise<ClassSession[]> => {
  const response = await apiClient.get<ApiResponse<ClassSession[]>>('/class-sessions/');
  return response.data.data;
};

export const getClassSessionsWithFiltersFn = async (params: GetClassSessionsParams): Promise<PaginatedResponse<ClassSession>> => {
  try {
    const response = await apiClient.get<any>('/class-sessions/', {
      params: {
        search: params.search || undefined,
        page: params.page || 1,
        page_size: params.page_size || 10,
        ordering: params.ordering || undefined,
      },
    });
    
    const apiData = response.data;
    
    if (apiData.data && apiData.success !== undefined) {
      const sessionList = Array.isArray(apiData.data) ? apiData.data : [];
      return {
        count: sessionList.length,
        next: null,
        previous: null,
        results: sessionList,
      };
    }
    
    return apiData;
  } catch (error) {
    console.error('Error fetching class sessions:', error);
    throw error;
  }
};

export const getClassSessionByIdFn = async (id: string): Promise<ClassSession> => {
  const response = await apiClient.get<ApiResponse<ClassSession>>(`/class-sessions/${id}/`);
  return response.data.data;
};

export const createClassSessionFn = async (
  payload: CreateClassSessionPayload
): Promise<ClassSession> => {
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

/**
 * Export class sessions as Excel file
 */
export const exportClassSessionsExcelFn = async (params: GetClassSessionsParams): Promise<Blob> => {
  try {
    const response = await apiClient.get('/class-sessions/export_excel/', {
      params: {
        search: params.search || undefined,
        ordering: params.ordering || undefined,
      },
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting class sessions:', error);
    throw error;
  }
};
