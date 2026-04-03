import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTeacherFn } from '@/services/teacher.service';
import { CreateTeacherPayload, Teacher } from '@/types/teacher';

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation<Teacher, Error, CreateTeacherPayload>({
    mutationFn: createTeacherFn,
    onSuccess: () => {
      // Invalidate teachers query if we have logic for fetching the list in the future
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
};
