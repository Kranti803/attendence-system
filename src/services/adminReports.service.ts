import apiClient from '@/lib/axios';
import { ApiResponse } from '@/types/apiResponse';

export interface AdminReportSession {
  session_id: string;
  class_name: string;
  subject_code: string;
  date: string;
  teacher_name: string;
  teacher_id: string;
  department: string;
  total: number;
  present: number;
  absent: number;
  attendance_rate: number;
}

export interface AdminReportsSummary {
  total_sessions: number;
  average_rate: number;
  best_rate: number;
  worst_rate: number;
  total_present: number;
  total_absent: number;
}

export interface AdminReportsPagination {
  current_page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
}

export interface AdminReportsResponse {
  summary: AdminReportsSummary;
  pagination: AdminReportsPagination;
  sessions: AdminReportSession[];
}

export interface GetAdminReportsParams {
  start_date?: string;
  end_date?: string;
  department?: string;
  teacher_id?: string;
  status?: 'PRESENT' | 'ABSENT';
  search?: string;
  sort_by?: 'date' | 'class' | 'rate' | 'present' | 'department';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

export const getAdminReportsFn = async (params: GetAdminReportsParams): Promise<AdminReportsResponse> => {
  try {
    const response = await apiClient.get<any>('/admin-reports/sessions/', {
      params: {
        start_date: params.start_date || undefined,
        end_date: params.end_date || undefined,
        department: params.department || undefined,
        teacher_id: params.teacher_id || undefined,
        status: params.status || undefined,
        search: params.search || undefined,
        sort_by: params.sort_by || 'date',
        sort_order: params.sort_order || 'desc',
        page: params.page || 1,
        page_size: params.page_size || 10,
      },
    });

    const data = response.data;

    // Handle custom API response format
    if (data.data && data.success !== undefined) {
      return data.data as AdminReportsResponse;
    }

    return data as AdminReportsResponse;
  } catch (error) {
    console.error('Error fetching admin reports:', error);
    throw error;
  }
};

export const exportAdminReportsExcelFn = async (params: GetAdminReportsParams): Promise<Blob> => {
  try {
    const response = await apiClient.get('/admin-reports/export_excel/', {
      params: {
        start_date: params.start_date || undefined,
        end_date: params.end_date || undefined,
        department: params.department || undefined,
        teacher_id: params.teacher_id || undefined,
        status: params.status || undefined,
        search: params.search || undefined,
        sort_by: params.sort_by || 'date',
        sort_order: params.sort_order || 'desc',
      },
      responseType: 'blob',
    });

    return response.data;
  } catch (error) {
    console.error('Error exporting admin reports:', error);
    throw error;
  }
};
