import apiClient from "@/@core/data/client/api_client";
import { API_ENDPOINTS } from "@/@core/data/client/endpoints";
import {
  CreateLiveClassRequest,
  LiveClass,
  UpdateLiveClassRequest,
} from "../../main/types/live_class.types";

export class LiveClassClient {
  static async getByCommunityId(communityId: string): Promise<LiveClass[]> {
    const response = await apiClient.get<LiveClass[]>(
      `${API_ENDPOINTS.LIVE_CLASS}/community/${communityId}`,
    );
    return response.data;
  }

  static async create(data: CreateLiveClassRequest): Promise<LiveClass> {
    const response = await apiClient.post<LiveClass>(
      API_ENDPOINTS.LIVE_CLASS,
      data,
    );
    return response.data;
  }

  static async update(
    id: string,
    data: UpdateLiveClassRequest,
  ): Promise<LiveClass> {
    const response = await apiClient.patch<LiveClass>(
      `${API_ENDPOINTS.LIVE_CLASS}/${id}`,
      data,
    );
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.LIVE_CLASS}/${id}`);
  }
}
