import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QuestionClient } from '../client/question_client';
import { CreateQuestionRequest, Question, UpdateQuestionRequest } from '../../main/types/question.types';

const QUERY_KEYS = {
  QUESTIONS: ['questions'],
  QUESTION: (id: string) => ['question', id],
  QUESTIONS_BY_QUIZ: (quizId: string) => ['questions', 'quiz', quizId],
} as const;

/**
 * Hook para crear una pregunta
 */
export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuestionRequest) => QuestionClient.createQuestion(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTIONS_BY_QUIZ(data.quizId) });
    },
  });
};

/**
 * Hook para obtener preguntas por ID de quiz
 */
export const useQuestionsByQuiz = (quizId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.QUESTIONS_BY_QUIZ(quizId),
    queryFn: () => QuestionClient.getQuestionsByQuizId(quizId),
    enabled: !!quizId,
  });
};

/**
 * Hook para obtener una pregunta por ID
 */
export const useQuestion = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.QUESTION(id),
    queryFn: () => QuestionClient.getQuestionById(id),
    enabled: !!id,
  });
};

/**
 * Hook para actualizar una pregunta
 */
export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuestionRequest }) =>
      QuestionClient.updateQuestion(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTION(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTIONS_BY_QUIZ(data.quizId) });
    },
  });
};

/**
 * Hook para eliminar una pregunta
 */
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => QuestionClient.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTIONS });
    },
  });
};

export const QuestionService = {
  useCreateQuestion,
  useQuestionsByQuiz,
  useQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
};
