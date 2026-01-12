import { API_ENDPOINTS } from '@/@core/data/client/endpoints';
import { CreateQuestionRequest, Question, UpdateQuestionRequest } from '../../main/types/question.types';
import apiClient from '@/@core/data/client/api_client';

export class QuestionClient {
  /**
   * Crear una nueva pregunta
   */
  static async createQuestion(data: CreateQuestionRequest): Promise<Question> {
    const response = await apiClient.post<Question>(`${API_ENDPOINTS.QUESTION}`, data);
    return response.data;
  }

  /**
   * Obtener todas las preguntas de un quiz
   */
  static async getQuestionsByQuizId(quizId: string): Promise<Question[]> {
    const response = await apiClient.get<Question[]>(`${API_ENDPOINTS.QUESTION}/quiz/${quizId}`);
    return response.data;
  }

  /**
   * Obtener una pregunta por ID
   */
  static async getQuestionById(id: string): Promise<Question> {
    const response = await apiClient.get<Question>(`${API_ENDPOINTS.QUESTION}/${id}`);
    return response.data;
  }

  /**
   * Actualizar una pregunta
   */
  static async updateQuestion(id: string, data: UpdateQuestionRequest): Promise<Question> {
    const response = await apiClient.patch<Question>(`${API_ENDPOINTS.QUESTION}/${id}`, data);
    return response.data;
  }

  /**
   * Eliminar una pregunta
   */
  static async deleteQuestion(id: string): Promise<void> {
    const response = await apiClient.delete<void>(`${API_ENDPOINTS.QUESTION}/${id}`);
    return response.data;
  }
}
