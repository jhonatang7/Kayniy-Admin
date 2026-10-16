import apiClient from "@/@core/data/client/api_client";
import { API_ENDPOINTS } from "@/@core/data/client/endpoints";
import {
  CourseWithContent,
  CreateCourseRequest,
  ReorderCourseModulesRequest,
  UpdateCourseRequest,
} from "../../main/types/course.types";

export class CourseClient {
  static async getCoursesByCommunityId(communityId: string): Promise<CourseWithContent[]> {
    const response = await apiClient.get<CourseWithContent[]>(
      `${API_ENDPOINTS.COURSE}/community/${communityId}`,
    );
    return response.data;
  }

  static async createCourse(data: CreateCourseRequest): Promise<CourseWithContent> {
    const response = await apiClient.post<CourseWithContent>(API_ENDPOINTS.COURSE, data);
    return response.data;
  }

  static async getCourse(id: string): Promise<CourseWithContent> {
    const response = await apiClient.get<CourseWithContent>(
      `${API_ENDPOINTS.COURSE}/${id}`,
    );
    return response.data;
  }

  static async updateCourse(
    id: string,
    data: UpdateCourseRequest,
  ): Promise<CourseWithContent> {
    const response = await apiClient.patch<CourseWithContent>(
      `${API_ENDPOINTS.COURSE}/${id}`,
      data,
    );
    return response.data;
  }

  static async deleteCourse(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.COURSE}/${id}`);
  }

  static async reorderCourseModules(
    data: ReorderCourseModulesRequest,
  ): Promise<CourseWithContent> {
    const response = await apiClient.patch<CourseWithContent>(
      `${API_ENDPOINTS.COURSE}/order`,
      data,
    );
    return response.data;
  }
}