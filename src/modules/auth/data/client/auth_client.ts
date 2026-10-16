import apiClient, { addWithoutTokenHeader } from '@/@core/data/client/api_client';
import { API_ENDPOINTS } from '@/@core/data/client/endpoints';
import {
  AuthResponse,
  AuthMessageResponse,
  ChangePasswordRequest,
  FirstLoginPasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  User,
} from '../../main/types/auth.types';
import { TokenClient } from './token_client';

export class AuthClient {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${API_ENDPOINTS.AUTH}/login`,
      credentials,
      {
        withCredentials: true,
        headers: addWithoutTokenHeader(),
      }
    );
    TokenClient.saveToken(response.data.access_token);
    return response.data;
  }

  static async forgotPassword(
    data: ForgotPasswordRequest,
  ): Promise<AuthMessageResponse> {
    const response = await apiClient.post<AuthMessageResponse>(
      `${API_ENDPOINTS.AUTH}/forgot-password`,
      data,
      { headers: addWithoutTokenHeader() },
    );
    return response.data;
  }

  static async resetPassword(
    data: ResetPasswordRequest,
  ): Promise<AuthMessageResponse> {
    const response = await apiClient.post<AuthMessageResponse>(
      `${API_ENDPOINTS.AUTH}/reset-password`,
      data,
      { headers: addWithoutTokenHeader() },
    );
    return response.data;
  }

  static async me(): Promise<User> {
    const response = await apiClient.get<User>(`${API_ENDPOINTS.AUTH}/me`);
    return response.data;
  }

  static async setFirstLoginPassword(
    data: FirstLoginPasswordRequest,
  ): Promise<User> {
    const response = await apiClient.post<User>(
      `${API_ENDPOINTS.USER}/me/first-login-password`,
      data,
    );
    return response.data;
  }

  static async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await apiClient.patch<User>(
      `${API_ENDPOINTS.USER}/me/profile`,
      data,
    );
    return response.data;
  }

  static async changePassword(
    data: ChangePasswordRequest,
  ): Promise<AuthMessageResponse> {
    const response = await apiClient.post<AuthMessageResponse>(
      `${API_ENDPOINTS.USER}/me/password`,
      data,
    );
    return response.data;
  }

  static async logout(): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.AUTH}/logout`, {
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
    const { access_token } = response.data;
    TokenClient.saveToken(access_token);
  }
}
