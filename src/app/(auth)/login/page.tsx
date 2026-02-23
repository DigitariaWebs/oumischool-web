"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthProfile, useLogin } from "@/hooks/auth";
import { clearAuthToken, getAuthToken } from "@/lib/api-client";
import { BookOpen, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const hasToken = !!getAuthToken();
  const profile = useAuthProfile(hasToken);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [googlePending, setGooglePending] = useState(false);
  const login = useLogin();

  useEffect(() => {
    if (hasToken && profile.data) {
      if (String(profile.data.role).toUpperCase() === "ADMIN") {
        router.replace("/dashboard");
        return;
      }
      clearAuthToken();
      router.replace("/login?reason=admin_only");
    }
  }, [hasToken, profile.data, router]);

  const roleError =
    params.get("reason") === "admin_only"
      ? "Ce portail est réservé aux comptes super admin."
      : null;
  const oauthError = params.get("error");
  const oauthErrorMessage = oauthError ?? null;

  const handleGoogleLogin = () => {
    if (typeof window === "undefined") return;
    setGooglePending(true);
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    const redirectUri = `${window.location.origin}/google/callback`;
    const startUrl = `${apiBase}/auth/google/start?redirectUri=${encodeURIComponent(redirectUri)}`;
    window.location.assign(startUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await login.mutateAsync({ email, password });
      if (String(result.user.role).toUpperCase() !== "ADMIN") {
        clearAuthToken();
        setError("Ce portail est réservé aux comptes super admin.");
        return;
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Identifiants incorrects");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "oklch(0.195 0.025 250)" }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-20 -right-20 w-95 h-95 rounded-full opacity-10"
          style={{ background: "oklch(0.58 0.16 155)" }}
        />
        <div
          className="absolute -bottom-15 -left-15 w-70 h-70 rounded-full opacity-8"
          style={{ background: "oklch(0.58 0.16 155)" }}
        />
        <div
          className="absolute top-[40%] -right-10 w-40 h-40 rounded-full opacity-6"
          style={{ background: "oklch(0.72 0.14 80)" }}
        />

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(0.88 0.015 250) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="OumiSchool"
            width={140}
            height={40}
            className="h-10 w-auto"
          />
        </div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-16">
          <div className="space-y-6 max-w-sm">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "oklch(0.58 0.16 155 / 0.2)",
                border: "1px solid oklch(0.58 0.16 155 / 0.3)",
              }}
            >
              <BookOpen
                className="w-7 h-7"
                style={{ color: "oklch(0.72 0.14 155)" }}
              />
            </div>

            <div>
              <h1 className="font-display text-4xl font-light leading-tight text-white mb-4">
                La façon plus intelligente
                <br />
                <span style={{ color: "oklch(0.72 0.14 155)" }}>
                  de gérer l&apos;apprentissage.
                </span>
              </h1>
              <p
                style={{ color: "oklch(0.62 0.02 250)" }}
                className="text-sm leading-relaxed"
              >
                Superviser les tuteurs, suivre les progrès des étudiants, gérer
                les ressources — tout depuis un espace de travail
                d&apos;administration unifié.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex gap-6 pt-2">
              {[
                { value: "2.4k+", label: "Étudiants" },
                { value: "180+", label: "Tuteurs" },
                { value: "96%", label: "Satisfaction" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-semibold text-white">
                    {s.value}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: "oklch(0.58 0.03 250)" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom cards */}
        <div className="relative z-10 grid grid-cols-2 gap-3">
          {[
            { icon: "📚", label: "Ressources gérées", count: "3,200+" },
            { icon: "👨‍👩‍👧", label: "Familles actives", count: "870+" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl p-4"
              style={{
                background: "oklch(0.24 0.025 250)",
                border: "1px solid oklch(0.3 0.025 250)",
              }}
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-white font-semibold text-sm">
                {item.count}
              </div>
              <div
                className="text-xs mt-0.5"
                style={{ color: "oklch(0.55 0.02 250)" }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-10">
          <Image
            src="/logo.png"
            alt="OumiSchool"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
        </div>

        <div className="w-full max-w-95">
          {/* Header */}
          <div className="mb-8">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium mb-5"
              style={{
                background: "oklch(0.95 0.018 155)",
                color: "oklch(0.42 0.12 155)",
                border: "1px solid oklch(0.85 0.06 155)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: "oklch(0.58 0.16 155)" }}
              />
              Portail Admin
            </div>
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">
              Bienvenue
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Connectez-vous à votre compte admin pour continuer
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-medium text-foreground/80"
              >
                Adresse e-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@oumischool.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 rounded-xl border-border/80 bg-card text-sm placeholder:text-muted-foreground/50 focus-visible:ring-brand/40"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs font-medium text-foreground/80"
                >
                  Mot de passe
                </Label>
                <button
                  type="button"
                  className="text-xs font-medium hover:underline"
                  style={{ color: "oklch(0.52 0.14 155)" }}
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10 rounded-xl border-border/80 bg-card text-sm pr-10 placeholder:text-muted-foreground/50 focus-visible:ring-brand/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {(error || roleError || oauthErrorMessage) && (
              <p className="text-xs text-red-600 rounded-lg bg-red-50 border border-red-200 px-3 py-2">
                {error || roleError || oauthErrorMessage}
              </p>
            )}

            <Button
              type="submit"
              disabled={login.isPending}
              className="w-full h-10 rounded-xl font-medium text-sm mt-2 text-white"
              style={{ background: "oklch(0.58 0.16 155)" }}
            >
              {login.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connexion en cours…
                </>
              ) : (
                "Se connecter au tableau de bord"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border/60" />
            <span className="text-xs text-muted-foreground/60">or</span>
            <div className="flex-1 h-px bg-border/60" />
          </div>

          {/* SSO hint */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googlePending}
            className="w-full h-10 rounded-xl border border-border/80 text-sm font-medium text-foreground/70 bg-card hover:bg-muted/60 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {googlePending
              ? "Redirection vers Google..."
              : "Continuer avec Google SSO"}
          </button>

          <p className="text-center text-xs text-muted-foreground/50 mt-8">
            Protégé par la sécurité OumiSchool. &copy;{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
