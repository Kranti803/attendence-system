import apiClient from '@/lib/axios';
import { CreateStudentPayload, UpdateStudentPayload, Student } from '@/types/student';
import { ApiResponse } from '@/types/apiResponse';

export const createStudentFn = async (payload: CreateStudentPayload): Promise<Student> => {
  const formData = new FormData();
  formData.append('first_name', payload.first_name);
  formData.append('last_name', payload.last_name);
  formData.append('email', payload.email);
  if (payload.password) formData.append('password', payload.password);
  formData.append('phone_no', payload.phone_no);
  formData.append('address', payload.address);
  formData.append('roll_number', payload.roll_number);
  formData.append('department', payload.department);
  formData.append('year', payload.year.toString());

  if (payload.images && payload.images.length > 0) {
    payload.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const response = await apiClient.post<ApiResponse<Student>>('/students/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export const getAllStudentsFn = async (): Promise<Student[]> => {
  const response = await apiClient.get<ApiResponse<Student[]>>('/students/');
  return response.data.data;
};

export interface GetStudentsParams {
  search?: string;
  department?: string;
  year?: number;
  page?: number;
  page_size?: number;
  ordering?: string; // e.g., 'first_name', '-created_at'
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Export students as Excel file
 */
export const exportStudentsExcelFn = async (params: GetStudentsParams): Promise<Blob> => {
  try {
    const response = await apiClient.get('/students/export_excel/', {
      params: {
        search: params.search || undefined,
        department: params.department || undefined,
        year: params.year || undefined,
        ordering: params.ordering || undefined,
      },
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting students:', error);
    throw error;
  }
};

/**
 * Get students with filtering, searching, sorting, and pagination
 * All parameters are backend-powered
 */
export const getStudentsWithFiltersFn = async (params: GetStudentsParams): Promise<PaginatedResponse<Student>> => {
  try {
    const response = await apiClient.get<any>('/students/', {
      params: {
        search: params.search || undefined,
        department: params.department || undefined,
        year: params.year || undefined,
        page: params.page || 1,
        page_size: params.page_size || 10,
        ordering: params.ordering || undefined,
      },
    });
    
    console.log('Raw API Response:', response.data);
    
    // API returns custom format: { data: [...], success: true }
    // Need to transform to paginated format
    const apiData = response.data;
    
    // Check if response has custom format
    if (apiData.data && apiData.success !== undefined) {
      // Custom format: wrap array in paginated structure
      const studentList = Array.isArray(apiData.data) ? apiData.data : [];
      return {
        count: studentList.length,
        next: null,
        previous: null,
        results: studentList,
      };
    }
    
    // Otherwise assume standard DRF paginated format
    return apiData;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const updateStudentFn = async ({ id, payload }: { id: string, payload: UpdateStudentPayload }): Promise<Student> => {
  const form = new FormData();
  (Object.keys(payload) as (keyof UpdateStudentPayload)[]).forEach((key) => {
    const value = payload[key];
    if (value !== null && value !== undefined && value !== '') {
      form.append(key, String(value));
    }
  });
  const response = await apiClient.patch<ApiResponse<Student>>(`/students/${id}/`, form);
  return response.data.data;
};

export const deleteStudentFn = async (id: string): Promise<void> => {
  await apiClient.delete(`/students/${id}/`);
};
