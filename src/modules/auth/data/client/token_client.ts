import { jwtDecode } from "jwt-decode";

export class TokenClient {
  private static readonly TOKEN_KEY = "access_token";

  static saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static validateToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp ? decodedToken.exp > currentTime : false;
    } catch {
      return false;
    }
  }
}