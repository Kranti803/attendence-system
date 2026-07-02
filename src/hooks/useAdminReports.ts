import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getAdminReportsFn,
  exportAdminReportsExcelFn,
  AdminReportsResponse,
  GetAdminReportsParams,
} from '@/services/adminReports.service';

export const useAdminReports = (params: GetAdminReportsParams) => {
  return useQuery<AdminReportsResponse, Error>({
    queryKey: ['admin-reports', params],
    queryFn: () => getAdminReportsFn(params),
  });
};

export const useExportAdminReportsExcel = () => {
  return useMutation<Blob, Error, GetAdminReportsParams>({
    mutationFn: exportAdminReportsExcelFn,
  });
};
