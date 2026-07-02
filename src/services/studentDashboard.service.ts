import apiClient from '@/lib/axios';

export interface StudentOverallStats {
  semester_attendance_rate: number;
  total_classes: number;
  classes_attended: number;
  classes_missed: number;
  streak: number;
}

export interface CourseAttendance {
  subject_id: string;
  subject_name: string;
  subject_code: string;
  teacher_name: string;
  total_classes: number;
  classes_attended: number;
  classes_missed: number;
  attendance_rate: number;
}

export interface EnrolledSubject extends CourseAttendance {
  teacher_email: string;
  department: string;
  semester: number;
}

export interface GetEnrolledSubjectsParams {
  search?: string;
  sort_by?: 'name' | 'code' | 'rate' | 'department';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

export interface EnrolledSubjectsResponse {
  subjects: EnrolledSubject[];
  pagination: {
    current_page: number;
    page_size: number;
    total_count: number;
    total_pages: number;
  };
}

// Add this interface for compatibility
export interface PaginatedEnrolledResponse {
  count: number;
  next: null;
  previous: null;
  results: EnrolledSubject[];
}

export interface UpcomingClass {
  class_session_id: string;
  class_name: string;
  subject_name: string;
  subject_code: string;
  date: string;
  start_time: string;
  end_time: string;
  teacher_name: string;
  room: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  time: string;
  subject_name: string;
  subject_code: string;
  class_name: string;
  teacher_name: string;
  status: 'PRESENT' | 'ABSENT';
  detection_confidence: number;
}

export interface AttendanceHistoryPagination {
  current_page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
}

export interface AttendanceHistoryResponse {
  records: AttendanceRecord[];
  pagination: AttendanceHistoryPagination;
  summary?: {
    total_present: number;
    total_absent: number;
  };
}

export interface GetAttendanceHistoryParams {
  search?: string;
  subject_id?: string;
  status?: 'PRESENT' | 'ABSENT';
  start_date?: string;
  end_date?: string;
  sort_by?: 'subject' | 'date' | 'status';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

export interface SubjectSession {
  date: string;
  class_name: string;
  status: 'PRESENT' | 'ABSENT';
  detection_confidence: number;
}

export interface SubjectDetailResponse {
  subject: {
    id: string;
    name: string;
    code: string;
    teacher_name: string;
    department: string;
    semester: number;
  };
  stats: {
    total_classes: number;
    classes_attended: number;
    classes_missed: number;
    attendance_rate: number;
  };
  sessions: SubjectSession[];
  pagination: AttendanceHistoryPagination;
}

export interface GetSubjectDetailParams {
  subject_id: string;
  search?: string;
  status?: 'PRESENT' | 'ABSENT';
  sort_by?: 'date' | 'status';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

export interface StudentProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_no: string;
  address: string;
  roll_number: string;
  department: string;
  year: number;
  is_active: boolean;
  enrollment_count: number;
  face_enrolled: boolean;
  face_photos: number;
  face_confidence: number;
}

export const getStudentOverallStatsFn = async (): Promise<StudentOverallStats> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: StudentOverallStats }>(
      '/student-dashboard/overall_stats/'
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching overall stats:', error);
    throw error;
  }
};

export const getStudentCourseAttendanceFn = async (): Promise<CourseAttendance[]> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: CourseAttendance[] }>(
      '/student-dashboard/course_attendance/'
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching course attendance:', error);
    throw error;
  }
};

export const getUpcomingClassesFn = async (daysAhead?: number): Promise<UpcomingClass[]> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: UpcomingClass[] }>(
      '/student-dashboard/upcoming_classes/',
      {
        params: {
          days: daysAhead || 7,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching upcoming classes:', error);
    throw error;
  }
};

export const getAttendanceHistoryFn = async (
  params: GetAttendanceHistoryParams
): Promise<AttendanceHistoryResponse> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: AttendanceHistoryResponse }>(
      '/student-dashboard/attendance_history/',
      {
        params: {
          search: params.search || undefined,
          subject_id: params.subject_id || undefined,
          status: params.status || undefined,
          start_date: params.start_date || undefined,
          end_date: params.end_date || undefined,
          sort_by: params.sort_by || 'date',
          sort_order: params.sort_order || 'desc',
          page: params.page || 1,
          page_size: params.page_size || 10,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching attendance history:', error);
    throw error;
  }
};


export const getEnrolledSubjectsFn = async (
  params?: GetEnrolledSubjectsParams
): Promise<EnrolledSubjectsResponse> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: any }>(
      '/student-dashboard/enrolled_subjects/',
      {
        params: {
          search: params?.search || undefined,
          sort_by: params?.sort_by || 'name',
          sort_order: params?.sort_order || 'asc',
          page: params?.page || 1,
          page_size: params?.page_size || 10,
        },
      }
    );
    
    console.log('Raw API Response for enrolled subjects:', response.data);
    
    const apiData = response.data;
    const data = apiData.data;
    
    // If data is an array (old format), wrap it in proper pagination structure
    if (Array.isArray(data)) {
      return {
        subjects: data,
        pagination: {
          current_page: params?.page || 1,
          page_size: params?.page_size || 10,
          total_count: data.length,
          total_pages: Math.ceil(data.length / (params?.page_size || 10)),
        },
      };
    }
    
    // If data has subjects and pagination (new format), return as-is
    if (data && typeof data === 'object' && 'subjects' in data && 'pagination' in data) {
      return data;
    }
    
    // Fallback to empty response
    return {
      subjects: [],
      pagination: {
        current_page: 1,
        page_size: 10,
        total_count: 0,
        total_pages: 0,
      },
    };
  } catch (error) {
    console.error('Error fetching enrolled subjects:', error);
    throw error;
  }
};

export const getSubjectDetailFn = async (
  params: GetSubjectDetailParams
): Promise<SubjectDetailResponse> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: SubjectDetailResponse }>(
      '/student-dashboard/subject_detail/',
      {
        params: {
          subject_id: params.subject_id,
          search: params.search || undefined,
          status: params.status || undefined,
          sort_by: params.sort_by || 'date',
          sort_order: params.sort_order || 'desc',
          page: params.page || 1,
          page_size: params.page_size || 10,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching subject detail:', error);
    throw error;
  }
};

export const getStudentProfileFn = async (): Promise<StudentProfile> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: StudentProfile }>(
      '/student-dashboard/profile/'
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching student profile:', error);
    throw error;
  }
};
