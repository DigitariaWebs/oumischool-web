import { clearAuthToken, getAuthToken } from "@/lib/api-client";
import { AppRole, mapBackendRole } from "@/lib/auth-role";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  status?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  role: AppRole;
  hydrated: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  markHydrated: () => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set) => ({
      token: null,
      user: null,
      role: "unknown" as AppRole,
      hydrated: false,
      setToken: (token) => {
        set((state) => {
          state.token = token;
        });
      },
      setUser: (user) => {
        set((state) => {
          state.user = user;
          state.role = mapBackendRole(user?.role);
        });
      },
      markHydrated: () => {
        set((state) => {
          state.hydrated = true;
          state.token = getAuthToken();
        });
      },
      clear: () => {
        clearAuthToken();
        set((state) => {
          state.token = null;
          state.user = null;
          state.role = "unknown";
          state.hydrated = true;
        });
      },
    })),
    {
      name: "auth_store",
      partialize: (state) => ({
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.hydrated = true;
        state.token = getAuthToken();
      },
    },
  ),
);
