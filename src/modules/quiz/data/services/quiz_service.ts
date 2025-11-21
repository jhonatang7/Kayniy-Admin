import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QuizClient } from '../client/quiz_client';
import { CreateQuizRequest, Quiz, UpdateQuizRequest } from '../../main/types/quiz.types';

const QUERY_KEYS = {
  QUIZZES: ['quizzes'],
  QUIZ: (id: string) => ['quiz', id],
  QUIZ_BY_MODULE: (moduleId: string) => ['quiz', 'module', moduleId],
} as const;

/**
 * Hook para crear un quiz
 */
export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuizRequest) => QuizClient.createQuiz(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZ_BY_MODULE(data.moduleId) });
    },
  });
};

/**
 * Hook para obtener todos los quizzes
 */
export const useQuizzes = () => {
  return useQuery({
    queryKey: QUERY_KEYS.QUIZZES,
    queryFn: () => QuizClient.getQuizzes(),
  });
};

/**
 * Hook para obtener un quiz por ID
 */
export const useQuiz = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.QUIZ(id),
    queryFn: () => QuizClient.getQuizById(id),
    enabled: !!id,
  });
};

/**
 * Hook para obtener quiz por ID de módulo
 */
export const useQuizByModule = (moduleId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.QUIZ_BY_MODULE(moduleId),
    queryFn: () => QuizClient.getQuizByModuleId(moduleId),
    enabled: !!moduleId,
  });
};

/**
 * Hook para actualizar un quiz
 */
export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuizRequest }) =>
      QuizClient.updateQuiz(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZ(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZ_BY_MODULE(data.moduleId) });
    },
  });
};

/**
 * Hook para eliminar un quiz
 */
export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => QuizClient.deleteQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES });
    },
  });
};

export const QuizService = {
  useCreateQuiz,
  useQuizzes,
  useQuiz,
  useQuizByModule,
  useUpdateQuiz,
  useDeleteQuiz,
};