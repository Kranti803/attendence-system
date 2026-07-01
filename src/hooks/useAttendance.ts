import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  markAttendanceFn,
  getClassAttendanceFn,
  getSessionSummaryFn,
  getMyAttendanceFn,
  getMyFaceEnrollmentStatusFn,
  startAttendanceSessionFn,
  endAttendanceSessionFn,
  getAllAttendanceFn,
  getAttendanceReportsFn,
  exportAttendanceExcelFn,
  AttendanceReportParams,
  AttendanceReportResponse,
} from '@/services/attendance.service';
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
 * Mutation: Mark attendance via face recognition.
 * Invalidates session summary + class attendance queries on success.
 */
export const useMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation<AttendanceMarkResponse, Error, AttendanceMarkPayload>({
    mutationFn: markAttendanceFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionSummary'] });
      queryClient.invalidateQueries({ queryKey: ['classAttendance'] });
    },
  });
};

/**
 * Mutation: Start a live attendance session.
 * Returns session_id for WebSocket connection.
 */
export const useStartAttendanceSession = () => {
  const queryClient = useQueryClient();

  return useMutation<AttendanceSessionStartResponse, Error, string>({
    mutationFn: startAttendanceSessionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionSummary'] });
      queryClient.invalidateQueries({ queryKey: ['classAttendance'] });
    },
  });
};

/**
 * Mutation: End a live attendance session.
 * Auto-marks all non-detected students as ABSENT.
 */
export const useEndAttendanceSession = () => {
  const queryClient = useQueryClient();

  return useMutation<AttendanceSessionEndResponse, Error, string>({
    mutationFn: endAttendanceSessionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionSummary'] });
      queryClient.invalidateQueries({ queryKey: ['classAttendance'] });
    },
  });
};

/**
 * Query: Get attendance records for a specific class session.
 * Only fetches when sessionId is provided.
 */
export const useClassAttendance = (sessionId: string | null) => {
  return useQuery<AttendanceRead[], Error>({
    queryKey: ['classAttendance', sessionId],
    queryFn: () => getClassAttendanceFn(sessionId!),
    enabled: !!sessionId,
  });
};

/**
 * Query: Get session summary (total, present, absent, rate).
 * Refetches every 5 seconds when enabled for live updates.
 */
export const useSessionSummary = (sessionId: string | null, isLive = false) => {
  return useQuery<SessionSummary, Error>({
    queryKey: ['sessionSummary', sessionId],
    queryFn: () => getSessionSummaryFn(sessionId!),
    enabled: !!sessionId,
    refetchInterval: isLive ? 5000 : false,
  });
};

/**
 * Query: Get all attendance records for teacher's subjects.
 */
export const useTeacherAttendance = () => {
  return useQuery<AttendanceRead[], Error>({
    queryKey: ['teacherAttendance'],
    queryFn: getAllAttendanceFn,
  });
};

/**
 * Query: Get current student's own attendance history.
 */
export const useMyAttendance = () => {
  return useQuery<AttendanceRead[], Error>({
    queryKey: ['myAttendance'],
    queryFn: getMyAttendanceFn,
  });
};

/**
 * Query: Get current student's face enrollment status.
 */
export const useMyFaceEnrollmentStatus = () => {
  return useQuery<FaceData, Error>({
    queryKey: ['myFaceEnrollmentStatus'],
    queryFn: getMyFaceEnrollmentStatusFn,
  });
};

/**
 * Query: Get filtered attendance records for reports.
 */
export const useAttendanceReports = (params: AttendanceReportParams) => {
  return useQuery<AttendanceReportResponse, Error>({
    queryKey: ['attendanceReports', params],
    queryFn: () => getAttendanceReportsFn(params),
  });
};

/**
 * Mutation: Export attendance records as Excel
 */
export const useExportAttendanceExcel = () => {
  return useMutation<Blob, Error, AttendanceReportParams>({
    mutationFn: exportAttendanceExcelFn,
  });
};
