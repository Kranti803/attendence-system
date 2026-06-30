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
  formData.append('semester', payload.semester.toString());

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
