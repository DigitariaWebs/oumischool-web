"use client";

import { StudentPageHeader } from "../_components/common";
import { MentalHealthIllustration } from "../_components/illustrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bell,
  Sun,
  Moon,
  Zap,
  Lock,
  Download,
  Mail,
  MessageSquare,
  Info,
  ToggleLeft,
} from "lucide-react";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

export default function StudentSettingsPage() {
  const [theme, setTheme] = useState<ThemeMode>("system");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    if (theme === "light") root.classList.remove("dark");
    if (theme === "system") {
      const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", dark);
    }
  }, [theme]);

  return (
    <div className="flex min-h-full flex-col">
      <StudentPageHeader
        title="Paramètres"
        subtitle="Personnalisation de l’affichage"
      />
      {/* Header with Illustration */}
      <div className="border-b border-border/50 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 px-3 py-8 md:px-6 md:py-12">
        <div className="grid items-center gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-black text-gray-800 dark:text-white">
              Tes préférences
            </h2>
            <p className="mt-3 text-lg font-medium text-gray-700 dark:text-gray-300">
              Personnalise OumiSchool selon ton goût et tes besoins
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <MentalHealthIllustration />
          </div>
        </div>
      </div>
      <div className="space-y-6 p-3 md:p-6">
        {/* Theme Card */}
        <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white">
              <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Thème
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <label
              htmlFor="theme-select"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Choisir le thème
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  theme === "light"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                aria-label="Thème clair"
              >
                <Sun className="h-6 w-6" />
                <span className="text-xs font-medium">Clair</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  theme === "dark"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                aria-label="Thème sombre"
              >
                <Moon className="h-6 w-6" />
                <span className="text-xs font-medium">Sombre</span>
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  theme === "system"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                aria-label="Thème du système"
              >
                <ToggleLeft className="h-6 w-6" />
                <span className="text-xs font-medium">Système</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white">
              <Bell className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Notifications des sessions
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Sois averti des nouvelles sessions
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 cursor-pointer"
                defaultChecked
              />
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Rappels de devoirs
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Notifications pour tes devoirs
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer"
                  defaultChecked
                />
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Emails de l&apos;école
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Reçois des mises à jour
                  </p>
                </div>
                <input type="checkbox" className="h-5 w-5 cursor-pointer" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Card */}
        <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-950 dark:to-cyan-950 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white">
              <Lock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              Confidentialité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <Button
              variant="outline"
              className="h-12 w-full justify-start rounded-xl text-base font-semibold"
            >
              <Lock className="mr-3 h-5 w-5" />
              Modifier mon mot de passe
            </Button>
            <Button
              variant="outline"
              className="h-12 w-full justify-start rounded-xl text-base font-semibold"
            >
              <Mail className="mr-3 h-5 w-5" />
              Mettre à jour mon email
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tes données sont chiffrées et protégées selon la RGPD.
            </p>
          </CardContent>
        </Card>

        {/* Data Card */}
        <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white">
              <Download className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              Mes données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">
                Télécharger mes données
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Récupère une copie de toutes tes données personnelles
              </p>
              <Button
                variant="outline"
                className="w-full rounded-xl h-10 font-medium"
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger (JSON)
              </Button>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="font-medium text-gray-700 dark:text-gray-300">
                Supprimer mon compte
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mb-3">
                Cette action est irréversible. Tous tes données seront
                supprimées.
              </p>
              <Button
                variant="destructive"
                className="w-full rounded-xl h-10 font-medium"
              >
                Supprimer mon compte
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support Card */}
        <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-950 dark:to-red-950 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white">
              <MessageSquare className="h-6 w-6 text-rose-600 dark:text-rose-400" />
              Support & Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <Button
              variant="outline"
              className="h-12 w-full justify-start rounded-xl text-base font-semibold"
            >
              <MessageSquare className="mr-3 h-5 w-5" />
              Signaler un problème
            </Button>
            <Button
              variant="outline"
              className="h-12 w-full justify-start rounded-xl text-base font-semibold"
            >
              <MessageSquare className="mr-3 h-5 w-5" />
              Proposer une amélioration
            </Button>
          </CardContent>
        </Card>

        {/* About Card */}
        <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white">
              <Info className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />À
              propos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-6 text-sm">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">
                Version
              </p>
              <p className="text-gray-600 dark:text-gray-400">2.0.1</p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <p className="font-medium text-gray-700 dark:text-gray-300">
                Développé par
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                OumiSchool - 2024-2026
              </p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                Liens utiles
              </p>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Conditions d&apos;utilisation
                </a>
                <a
                  href="#"
                  className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
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
