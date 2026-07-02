import { useQuery } from '@tanstack/react-query';
import {
  getAnalyticsOverviewFn,
  getRecognitionStatsFn,
  getAttendanceTrendsFn,
  AnalyticsOverview,
  RecognitionStats,
  GetAttendanceTrendsParams,
} from '@/services/analytics.service';

export const useAnalyticsOverview = () => {
  return useQuery<AnalyticsOverview, Error>({
    queryKey: ['analytics-overview'],
    queryFn: getAnalyticsOverviewFn,
  });
};

export const useRecognitionStats = () => {
  return useQuery<RecognitionStats, Error>({
    queryKey: ['recognition-stats'],
    queryFn: getRecognitionStatsFn,
  });
};

export const useAttendanceTrends = (params?: GetAttendanceTrendsParams) => {
  return useQuery<{ trends: any[]; daysAnalyzed: number; interval: string }, Error>({
    queryKey: ['attendance-trends', params],
    queryFn: () => getAttendanceTrendsFn(params),
  });
};
