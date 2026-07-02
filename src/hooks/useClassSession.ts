import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createClassSessionFn,
  deleteClassSessionFn,
  getAllClassSessionsFn,
  getClassSessionsWithFiltersFn,
  updateClassSessionFn,
  exportClassSessionsExcelFn,
  GetClassSessionsParams,
  PaginatedResponse,
} from '@/services/classSession.service';
import {
  ClassSession,
  CreateClassSessionPayload,
  UpdateClassSessionPayload,
} from '@/types/classSession';

export const useClassSessions = () => {
  return useQuery<ClassSession[], Error>({
    queryKey: ['class-sessions'],
    queryFn: getAllClassSessionsFn,
  });
};

export const useClassSessionsWithFilters = (params: GetClassSessionsParams) => {
  return useQuery<PaginatedResponse<ClassSession>, Error>({
    queryKey: ['class-sessions', params],
    queryFn: () => getClassSessionsWithFiltersFn(params),
  });
};

export const useCreateClassSession = () => {
  const queryClient = useQueryClient();
  return useMutation<ClassSession, Error, CreateClassSessionPayload>({
    mutationFn: createClassSessionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-sessions'] });
    },
  });
};

export const useUpdateClassSession = () => {
  const queryClient = useQueryClient();
  return useMutation<ClassSession, Error, { id: string; payload: UpdateClassSessionPayload }>({
    mutationFn: ({ id, payload }) => updateClassSessionFn(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-sessions'] });
    },
  });
};

export const useDeleteClassSession = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteClassSessionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-sessions'] });
    },
  });
};

export const useExportClassSessionsExcel = () => {
  return useMutation<Blob, Error, GetClassSessionsParams>({
    mutationFn: exportClassSessionsExcelFn,
  });
};
