import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createEnrollmentFn, getAllEnrollmentsFn, updateEnrollmentFn, deleteEnrollmentFn } from '@/services/enrollment.service';
import { CreateEnrollmentPayload, UpdateEnrollmentPayload, Enrollment } from '@/types/enrollment';

export const useCreateEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation<Enrollment, Error, CreateEnrollmentPayload>({
    mutationFn: createEnrollmentFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
};

export const useEnrollments = () => {
  return useQuery<Enrollment[], Error>({
    queryKey: ['enrollments'],
    queryFn: getAllEnrollmentsFn,
  });
};

export const useUpdateEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation<Enrollment, Error, { id: string; payload: UpdateEnrollmentPayload }>({
    mutationFn: updateEnrollmentFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
};

export const useDeleteEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteEnrollmentFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
};
