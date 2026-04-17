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
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  location?: string | null;
  child?: {
    id: string;
    name?: string;
  } | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
}

export const authApi = {
  login: (body: LoginPayload) => api.post<AuthResponse>("/auth/login", body),
  refresh: (refreshToken: string) =>
    api.post<AuthResponse>("/auth/refresh", { refreshToken }),
  forgotPassword: (email: string) =>
    api.post<{ message: string }>("/auth/forgot-password", { email }),
  me: () => api.get<AuthProfile>("/users/me"),
  verifyEmail: (token: string) =>
    api.post<{ message: string }>("/auth/verify-email", { token }),
  changePassword: (body: ChangePasswordPayload) =>
    api.put<{ message: string }>("/users/me/password", body),
  updateProfile: (body: UpdateProfilePayload) =>
    api.put<AuthProfile>("/users/me", body),
};
