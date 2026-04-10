"use client";

import { useSessionBootstrap } from "@/hooks/auth/session";

export function SessionBootstrapper() {
  useSessionBootstrap();
  return null;
}
