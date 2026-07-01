import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  createSubjectFn,
  getAllSubjectsFn,
  getSubjectsWithFiltersFn,
  getSubjectByIdFn,
  updateSubjectFn,
  deleteSubjectFn,
  exportSubjectsExcelFn,
  GetSubjectsParams,
  PaginatedResponse,
} from '@/services/subject.service';
import { CreateSubjectPayload, UpdateSubjectPayload, Subject } from '@/types/subject';

export const useSubjects = () => {
  return useQuery<Subject[], Error>({
    queryKey: ['subjects'],
    queryFn: getAllSubjectsFn,
  });
};

export const useSubjectsWithFilters = (params: GetSubjectsParams) => {
  return useQuery<PaginatedResponse<Subject>, Error>({
    queryKey: ['subjects', params],
    queryFn: () => getSubjectsWithFiltersFn(params),
  });
};

export const useSubjectById = (id: string) => {
  return useQuery<Subject, Error>({
    queryKey: ['subjects', id],
    queryFn: () => getSubjectByIdFn(id),
    enabled: !!id,
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation<Subject, Error, CreateSubjectPayload>({
    mutationFn: createSubjectFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation<Subject, Error, { id: string; payload: UpdateSubjectPayload }>({
    mutationFn: ({ id, payload }) => updateSubjectFn(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      queryClient.invalidateQueries({ queryKey: ['subjects', id] });
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteSubjectFn,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      queryClient.removeQueries({ queryKey: ['subjects', id] });
    },
  });
};

export const useExportSubjectsExcel = () => {
  return useMutation<Blob, Error, GetSubjectsParams>({
    mutationFn: exportSubjectsExcelFn,
  });
};
