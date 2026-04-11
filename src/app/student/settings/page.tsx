"use client";

import { StudentPageHeader } from "../_components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Download, Info, Lock, Mail, MessageSquare } from "lucide-react";

export default function StudentSettingsPage() {
  return (
    <div className="flex min-h-full flex-col">
      <StudentPageHeader
        title="Paramètres"
        subtitle="Gère tes préférences et ton compte"
      />

      <div className="mx-auto w-full max-w-3xl space-y-5 p-4 md:p-8">
        {/* Notifications */}
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
              <Bell className="h-4 w-4 text-muted-foreground" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Notifications des sessions
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Reçois une alerte pour tes nouvelles sessions
                </p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 cursor-pointer accent-primary"
                defaultChecked
                aria-label="Activer les notifications de sessions"
              />
            </div>
            <div className="border-t border-border/60 pt-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Rappels de devoirs
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Notifications pour les leçons à faire
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer accent-primary"
                  defaultChecked
                  aria-label="Activer les rappels de devoirs"
                />
              </div>
            </div>
            <div className="border-t border-border/60 pt-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Emails de l&apos;école
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Reçois les mises à jour par email
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer accent-primary"
                  aria-label="Activer les emails de l'école"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compte & sécurité */}
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
              <Lock className="h-4 w-4 text-muted-foreground" />
              Compte & sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="h-10 w-full justify-start rounded-xl text-sm font-medium"
            >
              <Lock className="mr-2 h-4 w-4" />
              Modifier mon mot de passe
            </Button>
            <Button
              variant="outline"
              className="h-10 w-full justify-start rounded-xl text-sm font-medium"
            >
              <Mail className="mr-2 h-4 w-4" />
              Mettre à jour mon email
            </Button>
            <p className="pt-1 text-xs text-muted-foreground">
              Tes données sont chiffrées et protégées selon le RGPD.
            </p>
          </CardContent>
        </Card>

        {/* Mes données */}
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
              <Download className="h-4 w-4 text-muted-foreground" />
              Mes données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Télécharger mes données
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Récupère une copie de toutes tes données personnelles
              </p>
              <Button
                variant="outline"
                className="mt-3 h-10 w-full rounded-xl text-sm font-medium sm:w-auto"
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger (JSON)
              </Button>
            </div>
            <div className="border-t border-border/60 pt-4">
              <p className="text-sm font-medium text-foreground">
                Supprimer mon compte
              </p>
              <p className="mt-0.5 text-xs text-rose-600">
                Cette action est irréversible. Toutes tes données seront
                supprimées.
              </p>
              <Button
                variant="destructive"
                className="mt-3 h-10 w-full rounded-xl text-sm font-medium sm:w-auto"
              >
                Supprimer mon compte
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="h-10 w-full justify-start rounded-xl text-sm font-medium"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Signaler un problème
            </Button>
            <Button
              variant="outline"
              className="h-10 w-full justify-start rounded-xl text-sm font-medium"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Proposer une amélioration
            </Button>
          </CardContent>
        </Card>

        {/* À propos */}
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
              <Info className="h-4 w-4 text-muted-foreground" />À propos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium text-foreground">2.0.1</span>
            </div>
            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <span className="text-muted-foreground">Développé par</span>
              <span className="font-medium text-foreground">
                OumiSchool · 2024-2026
              </span>
            </div>
            <div className="border-t border-border/60 pt-3">
              <p className="mb-2 text-muted-foreground">Liens utiles</p>
              <div className="space-y-1.5">
                <a
                  href="#"
                  className="block text-sm text-primary hover:underline"
                >
                  Conditions d&apos;utilisation
                </a>
                <a
                  href="#"
                  className="block text-sm text-primary hover:underline"
                >
                  Politique de confidentialité
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
