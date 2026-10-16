export interface Role {
  id: string;
  name: string;
}

export interface UserCommunity {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isFirstLogin: boolean;
  avatarPath?: string | null;
  role: Role;
  community?: UserCommunity | null;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface FirstLoginPasswordRequest {
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface AuthMessageResponse {
  message: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}