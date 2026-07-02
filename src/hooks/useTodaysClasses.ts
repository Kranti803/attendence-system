import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

export interface TodayClass {
  id: string;
  class_name: string;
  subject_id: string;
  subject_name: string;
  subject_code: string;
  date: string;
  start_time: string;
  end_time: string;
  teacher_name: string;
  teacher_id: string;
  session_status: 'upcoming' | 'running' | 'completed';
  is_session_active: boolean;
  attendance_session_id?: string;  // NEW: WebSocket session ID for student streaming
  can_mark_attendance: boolean;
  has_marked_attendance: boolean;
  attendance_id?: string;
  attendance_confidence?: number;
  attendance_status?: 'PRESENT' | 'ABSENT';
}

export const getTodaysClassesFn = async (): Promise<TodayClass[]> => {
  try {
    const response = await apiClient.get<any>('/student-dashboard/todays_classes/');
    const data = response.data;
    
    if (data.data && data.success !== undefined) {
      return data.data as TodayClass[];
    }
    
    return data as TodayClass[];
  } catch (error) {
    console.error('Error fetching today\'s classes:', error);
    throw error;
  }
};

export const useTodaysClasses = () => {
  return useQuery<TodayClass[], Error>({
    queryKey: ['todaysClasses'],
    queryFn: getTodaysClassesFn,
    refetchInterval: 30000, // Refetch every 30 seconds to check session status
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 10000,
  });
};
