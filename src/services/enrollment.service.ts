import apiClient from '@/lib/axios';
import { CreateEnrollmentPayload, UpdateEnrollmentPayload, Enrollment } from '@/types/enrollment';
import { ApiResponse } from '@/types/apiResponse';

export const createEnrollmentFn = async (payload: CreateEnrollmentPayload): Promise<Enrollment> => {
  // Use json format as specified in swagger schema for POST /api/enrollments/
  // 'application/json', 'application/x-www-form-urlencoded', 'multipart/form-data' all supported, JSON is easiest
  const response = await apiClient.post<ApiResponse<Enrollment>>('/enrollments/', payload);
  return response.data?.data || response.data as unknown as Enrollment;
};

export const getAllEnrollmentsFn = async (): Promise<Enrollment[]> => {
  const response = await apiClient.get<ApiResponse<Enrollment[]>>('/enrollments/');
  // Some endpoints return { data: [..] } and some return [..] directly, try to handle gracefully
  return response.data?.data || response.data as unknown as Enrollment[];
};

export const updateEnrollmentFn = async ({ id, payload }: { id: string; payload: UpdateEnrollmentPayload }): Promise<Enrollment> => {
  const response = await apiClient.patch<ApiResponse<Enrollment>>(`/enrollments/${id}/`, payload);
  return response.data?.data || response.data as unknown as Enrollment;
};

export const deleteEnrollmentFn = async (id: string): Promise<void> => {
  await apiClient.delete(`/enrollments/${id}/`);
};
