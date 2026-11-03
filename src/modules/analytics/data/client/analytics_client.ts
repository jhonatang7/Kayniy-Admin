import apiClient from "@/@core/data/client/api_client";
import { API_ENDPOINTS } from "@/@core/data/client/endpoints";
import {
  AdminCohortsResponse,
  AdminFunnelResponse,
  AdminTreemapResponse,
  AnalyticsCommunity,
  AnalyticsCourse,
  AnalyticsQuery,
  ProfessorActivityAnalytics,
  ProfessorBottlenecksAnalytics,
  ProfessorStudentRiskAnalytics,
} from "../../main/types/analytics.types";

const getQueryConfig = (query: AnalyticsQuery) => ({ params: query });

export class AnalyticsClient {
  static async getAdminFunnel(
    query: AnalyticsQuery,
  ): Promise<AdminFunnelResponse> {
    const response = await apiClient.get<AdminFunnelResponse>(
      `${API_ENDPOINTS.ANALYTICS}/admin/funnel`,
      getQueryConfig(query),
    );
    return response.data;
  }

  static async getAdminCohorts(
    query: AnalyticsQuery,
  ): Promise<AdminCohortsResponse> {
    const response = await apiClient.get<AdminCohortsResponse>(
      `${API_ENDPOINTS.ANALYTICS}/admin/cohorts`,
      getQueryConfig(query),
    );
    return response.data;
  }

  static async getAdminTreemap(
    query: AnalyticsQuery,
  ): Promise<AdminTreemapResponse> {
    const response = await apiClient.get<AdminTreemapResponse>(
      `${API_ENDPOINTS.ANALYTICS}/admin/treemap`,
      getQueryConfig(query),
    );
    return response.data;
  }

  static async getAdminCourses(): Promise<AnalyticsCourse[]> {
    const response = await apiClient.get<AnalyticsCourse[]>(
      `${API_ENDPOINTS.ANALYTICS}/courses`,
    );
    return response.data;
  }

  static async getAdminCommunities(): Promise<AnalyticsCommunity[]> {
    const response = await apiClient.get<AnalyticsCommunity[]>(
      `${API_ENDPOINTS.ANALYTICS}/communities`,
    );
    return response.data;
  }

  static async getProfessorCourses(
    communityId: string,
  ): Promise<AnalyticsCourse[]> {
    const response = await apiClient.get<AnalyticsCourse[]>(
      `${API_ENDPOINTS.ANALYTICS}/professor/${communityId}/courses`,
    );
    return response.data;
  }

  static async getProfessorBottlenecks(
    communityId: string,
    query: AnalyticsQuery,
  ): Promise<ProfessorBottlenecksAnalytics> {
    const response = await apiClient.get<ProfessorBottlenecksAnalytics>(
      `${API_ENDPOINTS.ANALYTICS}/professor/${communityId}/bottlenecks`,
      getQueryConfig(query),
    );
    return response.data;
  }

  static async getProfessorStudentRisk(
    communityId: string,
    query: AnalyticsQuery,
  ): Promise<ProfessorStudentRiskAnalytics> {
    const response = await apiClient.get<ProfessorStudentRiskAnalytics>(
      `${API_ENDPOINTS.ANALYTICS}/professor/${communityId}/student-risk`,
      getQueryConfig(query),
    );
    return response.data;
  }

  static async getProfessorActivity(
    communityId: string,
    query: AnalyticsQuery,
  ): Promise<ProfessorActivityAnalytics> {
    const response = await apiClient.get<ProfessorActivityAnalytics>(
      `${API_ENDPOINTS.ANALYTICS}/professor/${communityId}/activity`,
      getQueryConfig(query),
    );
    return response.data;
  }
}
