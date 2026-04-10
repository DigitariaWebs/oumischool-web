"use client";

import { authApi, LoginPayload } from "./api";
import { authKeys } from "./keys";
import { clearAuthToken, setAuthToken } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
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

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
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
