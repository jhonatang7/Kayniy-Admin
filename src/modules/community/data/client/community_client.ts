import {
  AddCommunityMembersRequest,
  Community,
  CommunityMember,
  CommunityMemberWithCommunity,
  CreateCommunityRequest,
} from "../../main/types/community.types";
import apiClient from "@/@core/data/client/api_client";
import { API_ENDPOINTS } from "@/@core/data/client/endpoints";

export class CommunityClient {
  /**
   * Crear un nuevo módulo
   */
  static async createCommunity(
    data: CreateCommunityRequest,
  ): Promise<Community> {
    const response = await apiClient.post<Community>(
      `${API_ENDPOINTS.COMMUNITY}`,
      data,
    );
    return response.data;
  }

  static async getCommunities(): Promise<Community[]> {
    const response = await apiClient.get<Community[]>(
      `${API_ENDPOINTS.COMMUNITY}`,
    );
    return response.data;
  }

  static async getCommunity(id: string): Promise<Community> {
    const response = await apiClient.get<Community>(
      `${API_ENDPOINTS.COMMUNITY}/${id}`,
    );
    return response.data;
  }

  static async updateCommunity(
    id: string,
    data: CreateCommunityRequest,
  ): Promise<Community> {
    const response = await apiClient.patch<Community>(
      `${API_ENDPOINTS.COMMUNITY}/${id}`,
      data,
    );
    return response.data;
  }

  static async deleteCommunity(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.COMMUNITY}/${id}`);
  }

  static async getMembersByType(memberType: string): Promise<CommunityMember[]> {
    const response = await apiClient.get<CommunityMember[]>(
      `${API_ENDPOINTS.USER}/role/${memberType}`,
    );
    return response.data;
  }

  static async getMembersByCommunity(
    communityId: string,
  ): Promise<CommunityMemberWithCommunity[]> {
    const response = await apiClient.get<CommunityMemberWithCommunity[]>(
      `${API_ENDPOINTS.COMMUNITY_MEMBERS}/community/${communityId}`,
    );
    return response.data;
  }

  static async deleteMember(
    memberId: string,
  ): Promise<void> {
    await apiClient.delete(
      `${API_ENDPOINTS.COMMUNITY_MEMBERS}/${memberId}`,
    );
  }

  static async addMembers(
    data: AddCommunityMembersRequest,
  ): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.COMMUNITY_MEMBERS}`, data);
  }
}
