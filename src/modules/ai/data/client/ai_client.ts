import apiClient from "@/@core/data/client/api_client";
import { API_ENDPOINTS } from "@/@core/data/client/endpoints";
import { ChatRequest, ChatResponse } from "../../main/types/ai.types";

export class AiClient {
  static async ingest(): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.AI}/ingest`);
  }

  static async chat(data: ChatRequest): Promise<ChatResponse> {
    const response = await apiClient.post<ChatResponse>(
      `${API_ENDPOINTS.AI}/chat`,
      data,
    );
    return response.data;
  }
}
