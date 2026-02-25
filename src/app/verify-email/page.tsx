"use client";

import { Button } from "@/components/ui/button";
import { useVerifyEmail } from "@/hooks/auth";
import { BookOpen, CheckCircle2, Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function VerifyEmailContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const verifyEmail = useVerifyEmail();

  const isLoading = verifyEmail.isPending;
  const isSuccess = verifyEmail.isSuccess;
  const isError = verifyEmail.isError;
  const errorMessage = verifyEmail.error
    ? verifyEmail.error instanceof Error
      ? verifyEmail.error.message
      : "La vérification a échoué. Veuillez réessayer."
    : "Lien de vérification invalide ou expiré.";

  useEffect(() => {
    if (!token || isLoading || isSuccess || isError) return;
    verifyEmail.mutate(token);
  }, [token, verifyEmail, isLoading, isSuccess, isError]);

  return (
    <div className="min-h-screen bg-background flex">
      <div
        className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "oklch(0.195 0.025 250)" }}
      >
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
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(0.88 0.015 250) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="OumiSchool"
            width={140}
            height={40}
            className="h-10 w-auto"
          />
        </div>

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
          </div>
        </div>

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

      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        <div className="lg:hidden flex items-center gap-2.5 mb-10">
          <Image
            src="/logo.png"
            alt="OumiSchool"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
        </div>

        <div className="w-full max-w-sm">
          {!token && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center bg-red-50 border border-red-200">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Lien invalide
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Le lien de vérification est invalide ou a expiré.
              </p>
              <Button
                onClick={() => router.push("/login")}
                className="w-full h-10 rounded-xl font-medium text-sm"
                variant="outline"
              >
                Retour à la connexion
              </Button>
            </div>
          )}

          {token && isLoading && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Loader2
                  className="w-8 h-8 animate-spin"
                  style={{ color: "oklch(0.58 0.16 155)" }}
                />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Vérification en cours...
              </h2>
              <p className="text-sm text-muted-foreground">
                Veuillez patienter pendant que nous vérifions votre adresse
                email.
              </p>
            </div>
          )}

          {token && isSuccess && (
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{
                  background: "oklch(0.85 0.06 145 / 0.2)",
                  border: "1px solid oklch(0.7 0.12 145 / 0.3)",
                }}
              >
                <CheckCircle2
                  className="w-8 h-8"
                  style={{ color: "oklch(0.7 0.12 145)" }}
                />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Email vérifié avec succès !
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Votre adresse email a été confirmée. Vous pouvez maintenant
                accéder à votre compte.
              </p>
              <Button
                onClick={() => router.push("/login")}
                className="w-full h-10 rounded-xl font-medium text-sm text-white"
                style={{ background: "oklch(0.58 0.16 155)" }}
              >
                Se connecter
              </Button>
            </div>
          )}

          {token && isError && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center bg-red-50 border border-red-200">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Échec de la vérification
              </h2>
              <p className="text-sm text-muted-foreground mb-2">
                {errorMessage}
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                Le lien de vérification a peut-être expiré ou a déjà été
                utilisé.
              </p>
              <Button
                onClick={() => router.push("/login")}
                className="w-full h-10 rounded-xl font-medium text-sm"
                variant="outline"
              >
                Retour à la connexion
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2
            className="w-8 h-8 animate-spin"
            style={{ color: "oklch(0.58 0.16 155)" }}
          />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
