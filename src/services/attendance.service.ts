import apiClient from '@/lib/axios';
import {
  AttendanceMarkPayload,
  AttendanceMarkResponse,
  AttendanceRead,
  SessionSummary,
  FaceData,
  AttendanceSessionStartResponse,
  AttendanceSessionEndResponse,
} from '@/types/attendance';

/**
 * Mark attendance via face recognition.
 * Sends the captured image + class_session_id as multipart/form-data.
 */
export const markAttendanceFn = async (
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

  const response = await apiClient.post<AttendanceMarkResponse>('/attendance/mark/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  // Backend may return data directly or wrapped in { data: ... }
  return (response.data as any)?.data || response.data;
};

/**
 * Get attendance records for a specific class session (teacher only).
 * Requires `session_id` query parameter.
 */
export const getClassAttendanceFn = async (sessionId: string): Promise<AttendanceRead[]> => {
  const response = await apiClient.get<AttendanceRead[]>('/attendance/class_attendance/', {
    params: { session_id: sessionId },
  });
  return (response.data as any)?.data || response.data;
};

/**
 * Get attendance summary for a class session (teacher only).
 * Returns total_students, present, absent, attendance_rate.
 */
export const getSessionSummaryFn = async (sessionId: string): Promise<SessionSummary> => {
  const response = await apiClient.get<SessionSummary>('/attendance/session_summary/', {
    params: { session_id: sessionId },
  });
  return (response.data as any)?.data || response.data;
};

/**
 * Get all attendance records for teacher's subjects.
 */
export const getAllAttendanceFn = async (): Promise<AttendanceRead[]> => {
  const response = await apiClient.get<AttendanceRead[]>('/attendance/');
  return (response.data as any)?.data || response.data;
};

/**
 * Get current student's own attendance history (student only).
 */
export const getMyAttendanceFn = async (): Promise<AttendanceRead[]> => {
  const response = await apiClient.get<AttendanceRead[]>('/attendance/my_attendance/');
  return (response.data as any)?.data || response.data;
};

/**
 * Get current student's face enrollment status.
 */
export const getMyFaceEnrollmentStatusFn = async (): Promise<FaceData> => {
  const response = await apiClient.get<FaceData>('/face-data/my_enrollment_status/');
  return (response.data as any)?.data || response.data;
};

// ── Live Attendance Session (WebSocket) ─────────────────────────────────────

const WS_BASE_URL = (process.env.NEXT_PUBLIC_WS_URL || 'wss://attendance-backend-d3vk.onrender.com')
  .replace(/^http/, 'ws')
  .replace(/^https/, 'wss');

export const getWebSocketUrl = (sessionId: string) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const baseUrl = `${WS_BASE_URL}/ws/attendance/stream/${sessionId}/`;

  if (!token) {
    return baseUrl;
  }

  return `${baseUrl}?token=${encodeURIComponent(token)}`;
};

/**
 * Start a live attendance session.
 * Returns session_id for WebSocket connection.
 */
export const startAttendanceSessionFn = async (
  classSessionId: string
): Promise<AttendanceSessionStartResponse> => {
  const response = await apiClient.post<AttendanceSessionStartResponse>(
    '/attendance/start_session/',
    { class_session_id: classSessionId }
  );
  return (response.data as any)?.data || response.data;
};

/**
 * End a live attendance session.
 * Auto-marks all non-detected students as ABSENT.
 * Returns summary with detected vs absent.
 */
export const endAttendanceSessionFn = async (
  sessionId: string
): Promise<AttendanceSessionEndResponse> => {
  const response = await apiClient.post<AttendanceSessionEndResponse>(
    '/attendance/end_session/',
    { session_id: sessionId }
  );
  return (response.data as any)?.data || response.data;
};
