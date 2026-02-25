"use client";

import { authApi, LoginPayload } from "./api";
import { authKeys } from "./keys";
import { clearAuthToken, setAuthToken } from "@/lib/api-client";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setAuthToken(data.tokens.accessToken);
      localStorage.setItem("refresh_token", data.tokens.refreshToken);
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      clearAuthToken();
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
