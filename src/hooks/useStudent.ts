import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createStudentFn, getAllStudentsFn, updateStudentFn, deleteStudentFn } from '@/services/student.service';
import { CreateStudentPayload, UpdateStudentPayload, Student } from '@/types/student';

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation<Student, Error, CreateStudentPayload>({
    mutationFn: createStudentFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useStudents = () => {
  return useQuery<Student[], Error>({
    queryKey: ['students'],
    queryFn: getAllStudentsFn,
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation<Student, Error, { id: string; payload: UpdateStudentPayload }>({
    mutationFn: updateStudentFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteStudentFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};
