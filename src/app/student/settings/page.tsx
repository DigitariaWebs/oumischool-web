"use client";

import { StudentPageHeader } from "../_components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="space-y-4 p-3 md:p-6">
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Thème</CardTitle>
          </CardHeader>
          <CardContent>
            <label
              htmlFor="theme-select"
              className="mb-2 block text-sm font-medium"
            >
              Choisir le thème
            </label>
            <select
              id="theme-select"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={theme}
              onChange={(event) => setTheme(event.target.value as ThemeMode)}
              aria-label="Choisir le thème"
            >
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
              <option value="system">Système</option>
            </select>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Langue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Français</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
