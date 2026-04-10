"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Award, TrendingUp } from "lucide-react";

export default function TutorHomePage() {
  return (
    <RoleGuard allowedRoles={["tutor"]}>
      <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
        {/* Header */}
        <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent px-4 py-8 md:px-6 md:py-12">
          <div className="max-w-5xl">
            <h1 className="text-4xl font-bold text-gray-800">
              Bienvenue sur OumiSchool
            </h1>
            <p className="mt-3 text-lg text-gray-700">
              Plateforme d&apos;enseignement moderne
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="px-4 py-12 md:px-6">
          <div className="max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              Notre plateforme en chiffres
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="rounded-2xl border-border/70 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">3,200+</p>
                      <p className="text-sm text-muted-foreground">
                        Ressources gérées
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/70 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">870+</p>
                      <p className="text-sm text-muted-foreground">
                        Familles actives
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/70 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">95%</p>
                      <p className="text-sm text-muted-foreground">
                        Satisfaction
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/70 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">+45%</p>
                      <p className="text-sm text-muted-foreground">
                        Progression moyenne
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 max-w-lg rounded-2xl border border-border bg-card p-6">
              <h3 className="text-xl font-semibold">Espace tuteur</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Le portail tuteur web sera enrichi progressivement. Vous êtes
                bien connecté avec un profil tuteur.
              </p>
            </div>
          </div>
        </div>
      </main>
    </RoleGuard>
  );
}
