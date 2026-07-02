import apiClient from '@/lib/axios';
import { CreateEnrollmentPayload, UpdateEnrollmentPayload, Enrollment } from '@/types/enrollment';
import { ApiResponse } from '@/types/apiResponse';

export interface GetEnrollmentsParams {
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

export const createEnrollmentFn = async (payload: CreateEnrollmentPayload): Promise<Enrollment> => {
  const response = await apiClient.post<ApiResponse<Enrollment>>('/enrollments/', payload);
  return response.data?.data || response.data as unknown as Enrollment;
};

export const getAllEnrollmentsFn = async (): Promise<Enrollment[]> => {
  const response = await apiClient.get<ApiResponse<Enrollment[]>>('/enrollments/');
  return response.data?.data || response.data as unknown as Enrollment[];
};

export const getEnrollmentsWithFiltersFn = async (params: GetEnrollmentsParams): Promise<PaginatedResponse<Enrollment>> => {
  try {
    const response = await apiClient.get<any>('/enrollments/', {
      params: {
        search: params.search || undefined,
        page: params.page || 1,
        page_size: params.page_size || 10,
        ordering: params.ordering || undefined,
      },
    });
    
    const apiData = response.data;
    
    if (apiData.data && apiData.success !== undefined) {
      const enrollmentList = Array.isArray(apiData.data) ? apiData.data : [];
      return {
        count: enrollmentList.length,
        next: null,
        previous: null,
        results: enrollmentList,
      };
    }
    
    return apiData;
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    throw error;
  }
};

export const updateEnrollmentFn = async ({ id, payload }: { id: string; payload: UpdateEnrollmentPayload }): Promise<Enrollment> => {
  const response = await apiClient.patch<ApiResponse<Enrollment>>(`/enrollments/${id}/`, payload);
  return response.data?.data || response.data as unknown as Enrollment;
};

export const deleteEnrollmentFn = async (id: string): Promise<void> => {
  await apiClient.delete(`/enrollments/${id}/`);
};

/**
 * Export enrollments as Excel file
 */
export const exportEnrollmentsExcelFn = async (params: GetEnrollmentsParams): Promise<Blob> => {
  try {
    const response = await apiClient.get('/enrollments/export_excel/', {
      params: {
        search: params.search || undefined,
        ordering: params.ordering || undefined,
      },
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting enrollments:', error);
    throw error;
  }
};
