import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  createTeacherFn,
  getAllTeachersFn,
  updateTeacherFn,
  deleteTeacherFn,
} from '@/services/teacher.service';
import { CreateTeacherPayload, UpdateTeacherPayload, Teacher } from '@/types/teacher';

export const useTeachers = () => {
  return useQuery<Teacher[], Error>({
    queryKey: ['teachers'],
    queryFn: getAllTeachersFn,
  });
};

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation<Teacher, Error, CreateTeacherPayload>({
    mutationFn: createTeacherFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
};

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation<Teacher, Error, { id: string; payload: UpdateTeacherPayload }>({
    mutationFn: ({ id, payload }) => updateTeacherFn(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
};

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteTeacherFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
};
