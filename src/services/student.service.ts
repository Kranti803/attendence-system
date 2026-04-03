import apiClient from '@/lib/axios';
import { CreateStudentPayload, Student } from '@/types/student';
import { ApiResponse } from '@/types/apiResponse';

export const createStudentFn = async (payload: CreateStudentPayload): Promise<Student> => {
  const formData = new FormData();
  formData.append('first_name', payload.first_name);
  formData.append('last_name', payload.last_name);
  formData.append('phone_no', payload.phone_no);
  formData.append('address', payload.address);
  formData.append('roll_number', payload.roll_number);
  formData.append('department', payload.department);
  formData.append('year', payload.year.toString());
  formData.append('user', payload.user);

  if (payload.photos && payload.photos.length > 0) {
    payload.photos.forEach((photo) => {
      formData.append('photos', photo);
    });
  }

  const response = await apiClient.post<ApiResponse<Student>>('/students/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};
