import apiClient from '@/lib/axios';
import { CreateSubjectPayload, UpdateSubjectPayload, Subject } from '@/types/subject';
import { ApiResponse } from '@/types/apiResponse';

export interface GetSubjectsParams {
  search?: string;
  department?: string;
  semester?: string;
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

export const getAllSubjectsFn = async (): Promise<Subject[]> => {
  const response = await apiClient.get<ApiResponse<Subject[]>>('/subjects/');
  return response.data.data;
};

export const getSubjectsWithFiltersFn = async (params: GetSubjectsParams): Promise<PaginatedResponse<Subject>> => {
  try {
    const response = await apiClient.get<any>('/subjects/', {
      params: {
        search: params.search || undefined,
        department: params.department || undefined,
        semester: params.semester || undefined,
        page: params.page || 1,
        page_size: params.page_size || 10,
        ordering: params.ordering || undefined,
      },
    });
    
    const apiData = response.data;
    
    // Check if response has custom format
    if (apiData.data && apiData.success !== undefined) {
      const subjectList = Array.isArray(apiData.data) ? apiData.data : [];
      return {
        count: subjectList.length,
        next: null,
        previous: null,
        results: subjectList,
      };
    }
    
    // Otherwise assume standard DRF paginated format
    return apiData;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }
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

/**
 * Export subjects as Excel file
 */
export const exportSubjectsExcelFn = async (params: GetSubjectsParams): Promise<Blob> => {
  try {
    const response = await apiClient.get('/subjects/export_excel/', {
      params: {
        search: params.search || undefined,
        department: params.department || undefined,
        semester: params.semester || undefined,
        ordering: params.ordering || undefined,
      },
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting subjects:', error);
    throw error;
  }
};
