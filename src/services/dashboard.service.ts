import apiClient from '@/lib/axios';

/**
 * Dashboard Stats Interface
 */
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  todayAttendanceRate: number;
  weeklyAttendance: WeeklyAttendanceData[];
  recentActivity: RecentActivityItem[];
}

/**
 * Recent Activity Item
 */
export interface RecentActivityItem {
  id: string;
  time: string;
  student: string;
  action: string;
  class: string;
  status: 'Present' | 'Absent' | 'Late';
  timestamp: string;
}

/**
 * Weekly Attendance Data
 */
export interface WeeklyAttendanceData {
  day: string;
  date: string;
  rate: number;
}

/**
 * Get all dashboard stats in ONE API call
 * This endpoint does all calculations on the backend for performance
 */
export const getDashboardStatsFn = async (): Promise<DashboardStats> => {
  try {
    const response = await apiClient.get('/dashboard/stats/');
    console.log('Raw API response:', response.data);
    
    // Handle response wrapper if it exists
    const data = response.data?.data || response.data;
    console.log('Extracted data:', data);
    
    return data;
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return {
      totalStudents: 0,
      totalTeachers: 0,
      totalClasses: 0,
      todayAttendanceRate: 0,
      weeklyAttendance: [],
      recentActivity: [],
    };
  }
};
