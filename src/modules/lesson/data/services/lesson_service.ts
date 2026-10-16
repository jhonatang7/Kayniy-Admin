import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LessonClient } from '../client/lesson_client';
import { CreateLessonRequest, ReorderLessonsRequest, UpdateLessonRequest } from '../../main/lesson.types';

const QUERY_KEYS = {
  LESSONS: ['lessons'],
  LESSON: (id: string) => ['lesson', id],
  LESSONS_BY_MODULE: (moduleId: string) => ['lessons', 'module', moduleId],
} as const;

/**
 * Hook para crear una lección
 */
export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLessonRequest) => LessonClient.createLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSONS });
    },
  });
};

/**
 * Hook para obtener todas las lecciones
 */
export const useLessons = () => {
  return useQuery({
    queryKey: QUERY_KEYS.LESSONS,
    queryFn: () => LessonClient.getLessons(),
  });
};

/**
 * Hook para obtener una lección por ID
 */
export const useLesson = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.LESSON(id),
    queryFn: () => LessonClient.getLessonById(id),
    enabled: !!id,
  });
};

/**
 * Hook para actualizar una lección
 */
export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLessonRequest }) =>
      LessonClient.updateLesson(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSON(variables.id) });
    },
  });
};

/**
 * Hook para eliminar una lección
 */
export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => LessonClient.deleteLesson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSONS });
    },
  });
};

export const useReorderLessons = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderLessonsRequest) => LessonClient.reorderLessons(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSONS_BY_MODULE(variables.moduleId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSONS });
    },
  });
};

export const useLessonsByModuleId = (moduleId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.LESSONS_BY_MODULE(moduleId),
    queryFn: () => LessonClient.getLessonsByModuleId(moduleId),
    enabled: !!moduleId,
  });
};

export const LessonService = {
  useCreateLesson,
  useLessons,
  useLesson,
  useUpdateLesson,
  useDeleteLesson,
  useReorderLessons,
  useLessonsByModuleId,
};
