import apiClient from "@/@core/data/client/api_client";
import { API_ENDPOINTS } from "@/@core/data/client/endpoints";
import { Admin, CreateAdminRequest } from "../../main/types/admin.types";

export class AdminClient {
  static async getAdmins(): Promise<Admin[]> {
    const response = await apiClient.get<Admin[]>(
      `${API_ENDPOINTS.USER}/admins`,
    );
    return response.data;
  }

  static async createAdmin(data: CreateAdminRequest): Promise<Admin> {
    const response = await apiClient.post<Admin>(
      `${API_ENDPOINTS.USER}/create-admin`,
      data,
    );
    return response.data;
  }

  static async deleteAdmin(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.USER}/admins/${id}`);
  }
}