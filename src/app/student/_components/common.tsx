"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";

export function StudentPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-gradient-to-b from-background via-background to-background/90 px-4 py-3 backdrop-blur md:px-6 md:py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
            Espace student
          </span>
          <h1 className="mt-1 text-lg font-semibold tracking-tight md:text-xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-xs text-muted-foreground md:text-sm">
              {subtitle}
            </p>
          ) : null}
        </div>
        {action}
      </div>
    </header>
  );
}

export function StudentLoadingCard({
  label = "Chargement...",
}: {
  label?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        <span>{label}</span>
      </CardContent>
    </Card>
  );
}

export function StudentErrorCard({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Erreur réseau</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="flex items-center gap-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          {message}
        </p>
        {onRetry ? (
          <Button onClick={onRetry} aria-label="Réessayer le chargement">
            Réessayer
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function StudentEmptyCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
