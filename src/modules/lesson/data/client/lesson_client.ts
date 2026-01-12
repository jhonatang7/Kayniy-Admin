import { HttpClient } from '@/@core/data/client/http_client';
import { API_ENDPOINTS } from '@/@core/data/client/endpoints';
import { CreateLessonRequest, Lesson, UpdateLessonRequest } from '../../main/lesson.types';
import apiClient from '@/@core/data/client/api_client';

export class LessonClient {
  /**
   * Crear una nueva lección
   */
  static async createLesson(data: CreateLessonRequest): Promise<Lesson> {
    // Si hay un archivo, enviar como FormData
    if (data.file) {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('type', data.type);
      formData.append('description', data.description);
      formData.append('duration', data.duration.toString());
      formData.append('moduleId', data.moduleId);
      formData.append('file', data.file);
      
      const response = await apiClient.post<Lesson>(`${API_ENDPOINTS.LESSON}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }
    
    // Si no hay archivo, enviar como JSON
    const { file, ...jsonData } = data;
    const response = await apiClient.post<Lesson>(`${API_ENDPOINTS.LESSON}`, jsonData);
    return response.data;
  }

  /**
   * Obtener todas las lecciones
   */
  static async getLessons(): Promise<Lesson[]> {
    const response = await apiClient.get<Lesson[]>(`${API_ENDPOINTS.LESSON}`);
    return response.data;
  }

  /**
   * Obtener una lección por ID
   */
  static async getLessonById(id: string): Promise<Lesson> {
    const response = await apiClient.get<Lesson>(`${API_ENDPOINTS.LESSON}/${id}`);
    return response.data;
  }

  /**
   * Actualizar una lección
   */
  static async updateLesson(id: string, data: UpdateLessonRequest): Promise<Lesson> {
    // Si hay un archivo, enviar como FormData
    if (data.file) {
      const formData = new FormData();
      if (data.title) formData.append('title', data.title);
      if (data.type) formData.append('type', data.type);
      if (data.description) formData.append('description', data.description);
      if (data.duration) formData.append('duration', data.duration.toString());
      formData.append('file', data.file);
      
      const response = await apiClient.patch<Lesson>(`${API_ENDPOINTS.LESSON}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }
    
    // Si no hay archivo, enviar como JSON
    const { file, ...jsonData } = data;
    const response = await apiClient.patch<Lesson>(`${API_ENDPOINTS.LESSON}/${id}`, jsonData);
    return response.data;
  }

  /**
   * Eliminar una lección
   */
  static async deleteLesson(id: string): Promise<void> {
    const response = await apiClient.delete<void>(`${API_ENDPOINTS.LESSON}/${id}`);
    return response.data;
  }

  static async getLessonsByModuleId(moduleId: string): Promise<Lesson[]> {
    const response = await apiClient.get<Lesson[]>(`${API_ENDPOINTS.LESSON}/find-by-module/${moduleId}`);
    return response.data;
  }
}
