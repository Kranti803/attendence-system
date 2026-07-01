import apiClient from '@/lib/axios';
import { CreateTeacherPayload, UpdateTeacherPayload, Teacher } from '@/types/teacher';
import { ApiResponse } from '@/types/apiResponse';

export interface GetTeachersParams {
  search?: string;
  department?: string;
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

export const getAllTeachersFn = async (): Promise<Teacher[]> => {
  const response = await apiClient.get<ApiResponse<Teacher[]>>('/teachers/');
  return response.data.data;
};

export const getTeachersWithFiltersFn = async (params: GetTeachersParams): Promise<PaginatedResponse<Teacher>> => {
  try {
    const response = await apiClient.get<any>('/teachers/', {
      params: {
        search: params.search || undefined,
        department: params.department || undefined,
        page: params.page || 1,
        page_size: params.page_size || 10,
        ordering: params.ordering || undefined,
      },
    });
    
    const apiData = response.data;
    
    // Check if response has custom format
    if (apiData.data && apiData.success !== undefined) {
      const teacherList = Array.isArray(apiData.data) ? apiData.data : [];
      return {
        count: teacherList.length,
        next: null,
        previous: null,
        results: teacherList,
      };
    }
    
    // Otherwise assume standard DRF paginated format
    return apiData;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }
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

/**
 * Export teachers as Excel file
 */
export const exportTeachersExcelFn = async (params: GetTeachersParams): Promise<Blob> => {
  try {
    const response = await apiClient.get('/teachers/export_excel/', {
      params: {
        search: params.search || undefined,
        department: params.department || undefined,
        ordering: params.ordering || undefined,
      },
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting teachers:', error);
    throw error;
  }
};
