import axios, { AxiosRequestConfig } from 'axios';
import { TokenClient } from '@/modules/auth/data/client/token_client';
import { AuthClient } from '@/modules/auth/data/client/auth_client';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 150000000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** used to identify if the request is a refresh token request */
const _refreshTokenHeader = 'x-refresh-token';

/** used to identify if the request should be made without an access token */
const _withoutTokenHeader = 'x-without-token';

export const addWithoutTokenHeader = () => ({ [_withoutTokenHeader]: true });

apiClient.interceptors.request.use(
  (config) => {
    if (config.headers[_withoutTokenHeader] || config.headers[_refreshTokenHeader]) {
      return config;
    }

    const tokenIsValid = TokenClient.validateToken();

    if (tokenIsValid) {
      addToken(config);
    } else {
      updateAccessToken(config);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest.headers[_refreshTokenHeader]) {
      AuthClient.logout();
      TokenClient.removeToken();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

const addToken = (config: AxiosRequestConfig) => {
  const token = TokenClient.getAccessToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
};

const updateAccessToken = (config: AxiosRequestConfig) => {
  console.log("Refreshing access token...");
  AuthClient.refreshToken().then(() => {
    addToken(config);
  });
};

export default apiClient;
