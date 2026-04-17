"use client";

import {
  authApi,
  ChangePasswordPayload,
  LoginPayload,
  UpdateProfilePayload,
} from "./api";
import { authKeys } from "./keys";
import { clearAuthToken, setAuthToken } from "@/lib/api-client";
import { isWebAllowedRole, mapBackendRole } from "@/lib/auth-role";
import { useAuthStore } from "@/store/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const WEB_ROLE_BLOCKED_MESSAGE =
  "L'accès web est réservé aux élèves et administrateurs. Utilise l'app mobile.";

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const data = await authApi.login(payload);
      const role = mapBackendRole(data.user.role);
      if (!isWebAllowedRole(role)) {
        throw new Error(WEB_ROLE_BLOCKED_MESSAGE);
      }
      return data;
    },
    onSuccess: (data) => {
      setAuthToken(data.tokens.accessToken);
      localStorage.setItem("refresh_token", data.tokens.refreshToken);
      useAuthStore.getState().setToken(data.tokens.accessToken);
      useAuthStore.getState().setUser(data.user);
      qc.setQueryData(authKeys.profile(), data.user);
      void qc.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      clearAuthToken();
      useAuthStore.getState().clear();
      qc.removeQueries({ queryKey: authKeys.profile() });
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}

export function useStudentProfile() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authApi.me(),
  });
}

export function useStudentChildId() {
  const profile = useStudentProfile();
  return profile.data?.child?.id ?? null;
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      authApi.changePassword(payload),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      authApi.updateProfile(payload),
    onSuccess: (data) => {
      useAuthStore.getState().setUser(data);
      qc.setQueryData(authKeys.profile(), data);
    },
  });
}

export function useAuthProfile(enabled = true) {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: authApi.me,
    enabled,
    retry: false,
  });
}
