"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff, GraduationCap, Loader2 } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    window.location.href = "/dashboard";
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
          className="absolute top-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full opacity-10"
          style={{ background: "oklch(0.58 0.16 155)" }}
        />
        <div
          className="absolute bottom-[-60px] left-[-60px] w-[280px] h-[280px] rounded-full opacity-8"
          style={{ background: "oklch(0.58 0.16 155)" }}
        />
        <div
          className="absolute top-[40%] right-[-40px] w-[160px] h-[160px] rounded-full opacity-6"
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
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(0.58 0.16 155)" }}
          >
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            OumiSchool
          </span>
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
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(0.58 0.16 155)" }}
          >
            <GraduationCap className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-semibold text-base tracking-tight">
            OumiSchool
          </span>
        </div>

        <div className="w-full max-w-[380px]">
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-xl font-medium text-sm mt-2 text-white"
              style={{ background: "oklch(0.58 0.16 155)" }}
            >
              {isLoading ? (
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
            Continuer avec Google SSO
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
