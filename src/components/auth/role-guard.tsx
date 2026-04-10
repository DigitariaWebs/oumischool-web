"use client";

import { useSessionBootstrap } from "@/hooks/auth";
import { AppRole, getHomeRouteByRole, mapBackendRole } from "@/lib/auth-role";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleGuardProps {
  allowedRoles: AppRole[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RoleGuard({
  allowedRoles,
  fallback = null,
  children,
}: RoleGuardProps) {
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);
  const { token, user, isRestoring, hydrated } = useSessionBootstrap();

  useEffect(() => {
    if (!hydrated || isRestoring) return;

    if (!token) {
      clear();
      router.replace("/sign-in");
      return;
    }

    if (!user) return;

    const role = mapBackendRole(user.role);
    if (!allowedRoles.includes(role)) {
      router.replace(getHomeRouteByRole(role));
    }
  }, [allowedRoles, clear, hydrated, isRestoring, router, token, user]);

  if (!hydrated || isRestoring || !token || !user) {
    return fallback;
  }

  const role = mapBackendRole(user.role);
  if (!allowedRoles.includes(role)) {
    return fallback;
  }

  return <>{children}</>;
}
