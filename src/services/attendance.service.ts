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


/**
 * Get filtered attendance records for reports (teacher only).
 * Supports date range, status, search, sort, and pagination filtering.
 */
export interface AttendanceReportParams {
  startDate?: string;      // YYYY-MM-DD
  endDate?: string;        // YYYY-MM-DD
  status?: 'PRESENT' | 'ABSENT';
  search?: string;         // Student name/roll number
  sortBy?: 'date' | 'class' | 'rate' | 'present';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface AttendanceReportResponse {
  summary: {
    total_sessions: number;
    average_rate: number;
    best_rate: number;
    worst_rate: number;
    total_present: number;
    total_absent: number;
  };
  pagination: {
    current_page: number;
    page_size: number;
    total_count: number;
    total_pages: number;
  };
  sessions: Array<{
    session_id: string;
    class_name: string;
    subject_code: string;
    date: string;
    total: number;
    present: number;
    absent: number;
    attendance_rate: number;
  }>;
}

export const getAttendanceReportsFn = async (
  params: AttendanceReportParams
): Promise<AttendanceReportResponse> => {
  const queryParams: any = {};

  if (params.startDate) {
    queryParams.start_date = params.startDate;
  }
  if (params.endDate) {
    queryParams.end_date = params.endDate;
  }
  if (params.status) {
    queryParams.status = params.status;
  }
  if (params.search) {
    queryParams.search = params.search;
  }
  if (params.sortBy) {
    queryParams.sort_by = params.sortBy;
  }
  if (params.sortOrder) {
    queryParams.sort_order = params.sortOrder;
  }
  if (params.page) {
    queryParams.page = params.page;
  }
  if (params.pageSize) {
    queryParams.page_size = params.pageSize;
  }

  const response = await apiClient.get<AttendanceReportResponse>('/attendance/reports/', {
    params: queryParams,
  });
  return (response.data as any)?.data || response.data;
};

/**
 * Export attendance data as Excel from backend
 */
export const exportAttendanceExcelFn = async (params: AttendanceReportParams): Promise<Blob> => {
  const queryParams: any = {};

  if (params.startDate) {
    queryParams.start_date = params.startDate;
  }
  if (params.endDate) {
    queryParams.end_date = params.endDate;
  }
  if (params.status) {
    queryParams.status = params.status;
  }
  if (params.search) {
    queryParams.search = params.search;
  }

  const response = await apiClient.get('/attendance/export_excel/', {
    params: queryParams,
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Export attendance data as CSV (frontend fallback)
 */
export const exportAttendanceToCSV = (data: AttendanceRead[]): void => {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // CSV Headers
  const headers = ['Date', 'Class', 'Student Name', 'Roll Number', 'Status', 'Confidence', 'Marked At'];
  
  // CSV Rows
  const rows = data.map((record) => {
    const date = new Date(record.marked_at).toISOString().split('T')[0];
    const time = new Date(record.marked_at).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    const confidence = record.verification_log 
      ? (record.verification_log.face_confidence * 100).toFixed(0)
      : 'N/A';
    
    return [
      date,
      record.class_session_detail?.class_name || record.class_session,
      record.student_detail?.name || record.student,
      record.student_detail?.roll_number || 'N/A',
      record.status,
      confidence,
      time,
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
