import { HttpClient } from '@/@core/data/client/http_client';
import { API_ENDPOINTS } from '@/@core/data/client/endpoints';
import { CreateQuizRequest, Quiz, UpdateQuizRequest } from '../../main/types/quiz.types';
import apiClient from '@/@core/data/client/api_client';

export class QuizClient {
  /**
   * Crear un nuevo quiz
   */
  static async createQuiz(data: CreateQuizRequest): Promise<Quiz> {
    const response = await apiClient.post<Quiz>(`${API_ENDPOINTS.QUIZ}`, data);
    return response.data;
  }

  /**
   * Obtener todos los quizzes
   */
  static async getQuizzes(): Promise<Quiz[]> {
    const response = await apiClient.get<Quiz[]>(`${API_ENDPOINTS.QUIZ}`);
    return response.data;
  }

  /**
   * Obtener un quiz por ID
   */
  static async getQuizById(id: string): Promise<Quiz> {
    const response = await apiClient.get<Quiz>(`${API_ENDPOINTS.QUIZ}/${id}`);
    return response.data;
  }

  /**
   * Obtener quiz por ID de módulo
   */
  static async getQuizByModuleId(moduleId: string): Promise<Quiz | null> {
    const response = await apiClient.get<Quiz>(`${API_ENDPOINTS.QUIZ}/find-by-module/${moduleId}`);
    return response.data;
  }

  /**
   * Actualizar un quiz
   */
  static async updateQuiz(id: string, data: UpdateQuizRequest): Promise<Quiz> {
    const response = await apiClient.patch<Quiz>(`${API_ENDPOINTS.QUIZ}/${id}`, data);
    return response.data;
  }

  /**
   * Eliminar un quiz
   */
  static async deleteQuiz(id: string): Promise<void> {
    const response = await apiClient.delete<void>(`${API_ENDPOINTS.QUIZ}/${id}`);
    return response.data;
  }
}