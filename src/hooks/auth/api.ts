import { api } from "@/lib/api-client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface AuthProfile {
  id: string;
  email: string;
  role: string;
  status: string;
}

export const authApi = {
  login: (body: LoginPayload) => api.post<AuthResponse>("/auth/login", body),
  refresh: (refreshToken: string) =>
    api.post<AuthResponse>("/auth/refresh", { refreshToken }),
  forgotPassword: (email: string) =>
    api.post<{ message: string }>("/auth/forgot-password", { email }),
  me: () => api.get<AuthProfile>("/users/me"),
};
