"use client";

import { clearAuthToken, setAuthToken } from "@/lib/api-client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GoogleCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : "";
    const params = new URLSearchParams(hash);

    const providerError = params.get("error");
    if (providerError) {
      clearAuthToken();
      router.replace(`/login?error=${encodeURIComponent(providerError)}`);
      return;
    }

    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const role = (params.get("role") ?? "").toUpperCase();

    if (!accessToken || !refreshToken) {
      clearAuthToken();
      router.replace(
        "/login?error=Google%20login%20did%20not%20return%20tokens.",
      );
      return;
    }

    if (role && role !== "ADMIN") {
      clearAuthToken();
      router.replace("/login?reason=admin_only");
      return;
    }

    setAuthToken(accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    router.replace("/dashboard");
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
        <h1 className="text-lg font-semibold text-foreground">
          Google sign-in
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Completing authentication...
        </p>
      </div>
    </main>
  );
}
