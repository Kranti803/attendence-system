import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStudentFn } from '@/services/student.service';
import { CreateStudentPayload, Student } from '@/types/student';

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation<Student, Error, CreateStudentPayload>({
    mutationFn: createStudentFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};
