import { useQuery } from '@tanstack/react-query';
import {
  getStudentOverallStatsFn,
  getStudentCourseAttendanceFn,
  getUpcomingClassesFn,
  getAttendanceHistoryFn,
  getEnrolledSubjectsFn,
  getSubjectDetailFn,
  getStudentProfileFn,
  StudentOverallStats,
  CourseAttendance,
  UpcomingClass,
  AttendanceHistoryResponse,
  GetAttendanceHistoryParams,
  EnrolledSubject,
  SubjectDetailResponse,
  GetSubjectDetailParams,
  StudentProfile,
  GetEnrolledSubjectsParams,
  EnrolledSubjectsResponse,
} from '@/services/studentDashboard.service';

export const useStudentOverallStats = () => {
  return useQuery<StudentOverallStats, Error>({
    queryKey: ['student-dashboard', 'overall-stats'],
    queryFn: () => getStudentOverallStatsFn(),
  });
};

export const useStudentCourseAttendance = () => {
  return useQuery<CourseAttendance[], Error>({
    queryKey: ['student-dashboard', 'course-attendance'],
    queryFn: () => getStudentCourseAttendanceFn(),
  });
};

export const useUpcomingClasses = (daysAhead?: number) => {
  return useQuery<UpcomingClass[], Error>({
    queryKey: ['student-dashboard', 'upcoming-classes', daysAhead || 7],
    queryFn: () => getUpcomingClassesFn(daysAhead),
  });
};

export const useAttendanceHistory = (params: GetAttendanceHistoryParams) => {
  return useQuery<AttendanceHistoryResponse, Error>({
    queryKey: ['student-dashboard', 'attendance-history', params],
    queryFn: () => getAttendanceHistoryFn(params),
  });
};

export const useEnrolledSubjects = (params?: GetEnrolledSubjectsParams) => {
  return useQuery<EnrolledSubjectsResponse, Error>({
    queryKey: ['student-dashboard', 'enrolled-subjects', params],
    queryFn: () => getEnrolledSubjectsFn(params),
  });
};

export const useSubjectDetail = (params: GetSubjectDetailParams) => {
  return useQuery<SubjectDetailResponse, Error>({
    queryKey: ['student-dashboard', 'subject-detail', params],
    queryFn: () => getSubjectDetailFn(params),
  });
};

export const useStudentProfile = () => {
  return useQuery<StudentProfile, Error>({
    queryKey: ['student-dashboard', 'profile'],
    queryFn: () => getStudentProfileFn(),
  });
};
