"use client";

import { authApi } from "./api";
import { ApiError, getAuthToken } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth";
import { useEffect, useMemo, useState } from "react";

const RETRY_DELAYS_MS = [300, 900, 1600] as const;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function restoreSessionProfile() {
  let attempt = 0;
  let lastError: unknown = null;

  while (attempt < RETRY_DELAYS_MS.length) {
    try {
      return await authApi.me();
    } catch (error) {
      lastError = error;
      const status = error instanceof ApiError ? error.status : undefined;
      if (status === 401 || status === 403) throw error;
      const isLastTry = attempt === RETRY_DELAYS_MS.length - 1;
      if (!isLastTry) {
        await wait(RETRY_DELAYS_MS[attempt]);
      }
      attempt += 1;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Session restore failed");
}

export function useSessionBootstrap() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clear);
  const markHydrated = useAuthStore((s) => s.markHydrated);
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) {
      markHydrated();
    }
  }, [hydrated, markHydrated]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const persistedToken = getAuthToken();
      setToken(persistedToken);

      if (!persistedToken) {
        if (!cancelled) {
          setUser(null);
          setError(null);
        }
        return;
      }

      if (user) {
        setError(null);
        return;
      }

      setIsRestoring(true);
      setError(null);

      try {
        const profile = await restoreSessionProfile();
        if (!cancelled) {
          setUser(profile);
        }
      } catch (err) {
        const status = err instanceof ApiError ? err.status : undefined;
        if (!cancelled) {
          if (status === 401 || status === 403) {
            clear();
            setError("Session expirée. Veuillez vous reconnecter.");
          } else {
            setError(
              err instanceof Error
                ? err.message
                : "Restauration de session impossible",
            );
          }
        }
      } finally {
        if (!cancelled) {
          setIsRestoring(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [clear, setToken, setUser, user]);

  return useMemo(
    () => ({
      token,
      user,
      hydrated,
      isRestoring,
      error,
    }),
    [token, user, hydrated, isRestoring, error],
  );
}
