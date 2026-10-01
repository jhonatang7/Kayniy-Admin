import apiClient from "@/@core/data/client/api_client";
import { API_ENDPOINTS } from "@/@core/data/client/endpoints";
import {
  CreateTeacherRequest,
  Teacher,
  UpdateTeacherRequest,
} from "../../main/types/teacher.types";

export class TeacherClient {
  static async getTeachers(): Promise<Teacher[]> {
    const response = await apiClient.get<Teacher[]>(
      `${API_ENDPOINTS.USER}/role/TEACHER`,
    );
    return response.data;
  }

  static async getTeacherById(id: string): Promise<Teacher> {
    const response = await apiClient.get<Teacher>(
      `${API_ENDPOINTS.USER}/${id}`,
    );
    return response.data;
  }

  static async createTeacher(data: CreateTeacherRequest): Promise<Teacher> {
    const response = await apiClient.post<Teacher>(`${API_ENDPOINTS.USER}/create-teacher`, data);
    return response.data;
  }

  static async updateTeacher(
    id: string,
    data: UpdateTeacherRequest,
  ): Promise<Teacher> {
    const response = await apiClient.patch<Teacher>(
      `${API_ENDPOINTS.USER}/${id}/teacher-profile`,
      data,
    );
    return response.data;
  }

  static async deleteTeacher(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.USER}/${id}`);
  }
}