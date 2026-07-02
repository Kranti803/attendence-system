import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTemplateFn,
  deleteTemplateFn,
  getAllTemplatesFn,
  getMyTemplatesFn,
  getTodaysSessionsFn,
  getTemplateByIdFn,
  updateTemplateFn,
} from '@/services/classSessionTemplate.service';
import {
  ClassSessionTemplate,
  CreateClassSessionTemplatePayload,
  UpdateClassSessionTemplatePayload,
} from '@/types/classSessionTemplate';

export const useClassSessionTemplates = () => {
  return useQuery<ClassSessionTemplate[], Error>({
    queryKey: ['class-session-templates'],
    queryFn: getAllTemplatesFn,
  });
};

export const useMyTemplates = () => {
  return useQuery<ClassSessionTemplate[], Error>({
    queryKey: ['my-templates'],
    queryFn: getMyTemplatesFn,
  });
};

export const useTodaysTemplates = () => {
  return useQuery<ClassSessionTemplate[], Error>({
    queryKey: ['todays-templates'],
    queryFn: getTodaysSessionsFn,
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation<ClassSessionTemplate, Error, CreateClassSessionTemplatePayload>({
    mutationFn: createTemplateFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-session-templates'] });
      queryClient.invalidateQueries({ queryKey: ['my-templates'] });
      queryClient.invalidateQueries({ queryKey: ['todays-templates'] });
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation<ClassSessionTemplate, Error, { id: string; payload: UpdateClassSessionTemplatePayload }>({
    mutationFn: ({ id, payload }) => updateTemplateFn(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-session-templates'] });
      queryClient.invalidateQueries({ queryKey: ['my-templates'] });
      queryClient.invalidateQueries({ queryKey: ['todays-templates'] });
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteTemplateFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-session-templates'] });
      queryClient.invalidateQueries({ queryKey: ['my-templates'] });
      queryClient.invalidateQueries({ queryKey: ['todays-templates'] });
    },
  });
};
