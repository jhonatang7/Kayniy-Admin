import apiClient, { addWithoutTokenHeader } from '@/@core/data/client/api_client';
import { API_ENDPOINTS } from '@/@core/data/client/endpoints';
import { LoginRequest } from '../../main/types/auth.types';
import { User } from '../../main/types/auth.types';
import { TokenClient } from './token_client';

export class AuthClient {
  static async login(credentials: LoginRequest): Promise<{ access_token: string }> {
    console.log("AuthClient login called");
    const response = await apiClient.post<{ access_token: string }>(
      `${API_ENDPOINTS.AUTH}/login`,
      credentials,
      {
        withCredentials: true,
        headers: addWithoutTokenHeader(),
      }
    );
    console.log("Login response:", response);
    TokenClient.saveToken(response.data.access_token);
    return response.data;
  }

  static async me(): Promise<User> {
    const response = await apiClient.get<User>(`${API_ENDPOINTS.AUTH}/me`);
    return response.data;
  }

  static async logout(): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.AUTH}/logout`, {
      withCredentials: true,
      headers: addWithoutTokenHeader(),
    });
    TokenClient.removeToken();
  }

  static async refreshToken(): Promise<void> {
    const response = await apiClient.get(`${API_ENDPOINTS.AUTH}/refresh`, {
      withCredentials: true,
      headers: { 'x-refresh-token': true },
    });
    const { accessToken } = response.data;
    TokenClient.saveToken(accessToken);
  }
}
