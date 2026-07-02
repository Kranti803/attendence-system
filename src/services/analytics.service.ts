import apiClient from '@/lib/axios';
import { ApiResponse } from '@/types/apiResponse';

export interface RecognitionStats {
  successfulRecognitions: number;
  lowConfidence: number;
  failedRecognitions: number;
  totalAttempts: number;
  successRate: number;
  averageConfidence: number;
  timeSeriesData?: Array<{
    date: string;
    successful: number;
    lowConfidence: number;
    failed: number;
  }>;
}

export interface AttendanceTrend {
  date: string;
  rate: number;
  present: number;
  total: number;
}

export interface DepartmentComparison {
  name: string;
  rate: number;
  present: number;
  total: number;
  studentCount: number;
}

export interface TimeSlotData {
  time: string;
  rate: number;
  count: number;
  present: number;
}

export interface AnalyticsOverview {
  recognitionStats: RecognitionStats;
  attendanceTrends: AttendanceTrend[];
  departmentComparison: DepartmentComparison[];
  timeSlotDistribution: TimeSlotData[];
}

export const getAnalyticsOverviewFn = async (): Promise<AnalyticsOverview> => {
  try {
    const response = await apiClient.get<any>('/analytics/overview/');
    const data = response.data;
    
    // Handle custom API response format
    if (data.data && data.success !== undefined) {
      return data.data as AnalyticsOverview;
    }
    
    return data as AnalyticsOverview;
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    throw error;
  }
};

export const getRecognitionStatsFn = async (): Promise<RecognitionStats> => {
  try {
    const response = await apiClient.get<any>('/analytics/recognition_stats/');
    const data = response.data;
    
    // Handle custom API response format
    if (data.data && data.success !== undefined) {
      return data.data as RecognitionStats;
    }
    
    return data as RecognitionStats;
  } catch (error) {
    console.error('Error fetching recognition stats:', error);
    throw error;
  }
};

export interface GetAttendanceTrendsParams {
  days?: number;
  interval?: 'daily' | 'weekly' | 'monthly';
}

export const getAttendanceTrendsFn = async (
  params?: GetAttendanceTrendsParams
): Promise<{ trends: AttendanceTrend[]; daysAnalyzed: number; interval: string }> => {
  try {
    const response = await apiClient.get<any>('/analytics/attendance_trends/', {
      params: {
        days: params?.days || 180,
        interval: params?.interval || 'daily',
      },
    });
    const data = response.data;
    
    // Handle custom API response format
    if (data.data && data.success !== undefined) {
      return data.data;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching attendance trends:', error);
    throw error;
  }
};
