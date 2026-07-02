import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { AttendanceMarkPayload, AttendanceMarkResponse } from '@/types/attendance';

/**
 * Mark attendance via student self-service (requires active teacher session)
 * Only works when teacher has started a session for the class
 */
export const selfMarkAttendanceFn = async (
  payload: AttendanceMarkPayload
): Promise<AttendanceMarkResponse> => {
  const formData = new FormData();
  formData.append('image', payload.image);
  formData.append('class_session_id', payload.class_session_id);

  if (payload.latitude != null) formData.append('latitude', String(payload.latitude));
  if (payload.longitude != null) formData.append('longitude', String(payload.longitude));
  if (payload.distance_from_classroom != null)
    formData.append('distance_from_classroom', String(payload.distance_from_classroom));
  if (payload.liveness_passed) formData.append('liveness_passed', payload.liveness_passed);
  if (payload.timestamp_signed) formData.append('timestamp_signed', payload.timestamp_signed);

  const response = await apiClient.post<AttendanceMarkResponse>(
    '/attendance/mark-self/',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );

  return (response.data as any)?.data || response.data;
};

/**
 * Mutation: Mark attendance via student self-service
 */
export const useSelfMarkAttendance = () => {
  return useMutation<AttendanceMarkResponse, Error, AttendanceMarkPayload>({
    mutationFn: selfMarkAttendanceFn,
  });
};
