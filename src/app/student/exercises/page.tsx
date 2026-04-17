"use client";

import {
  StudentErrorCard,
  StudentLoadingCard,
  StudentPageHeader,
} from "../_components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentResources } from "@/hooks/student";
import { Gamepad2 } from "lucide-react";
import Link from "next/link";

export default function StudentExercisesPage() {
  const resourcesQuery = useStudentResources();
  const games = (resourcesQuery.data ?? []).filter((r) => r.isGame);

  return (
    <div className="flex min-h-full flex-col">
      <StudentPageHeader
        title="Exercices"
        subtitle="Jeux et activités pour t'entraîner"
      />

      <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent px-3 py-6 md:px-6 md:py-8">
        <div className="grid items-center gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Apprends en jouant
            </h2>
            <p className="mt-3 text-base text-gray-700">
              Explore les jeux proposés pour progresser dans tes matières
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <img
              src="/Mental health-cuate.svg"
              alt="Exercices"
              className="h-48 w-48 object-contain"
            />
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gamepad2 className="h-4 w-4 text-muted-foreground" />
              Jeux disponibles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {resourcesQuery.isLoading ? (
              <StudentLoadingCard label="Chargement des jeux..." />
            ) : null}
            {resourcesQuery.isError ? (
              <StudentErrorCard
                message="Impossible de charger les jeux."
                onRetry={() => void resourcesQuery.refetch()}
              />
            ) : null}
            {!resourcesQuery.isLoading &&
            !resourcesQuery.isError &&
            games.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucun jeu disponible pour le moment.
              </p>
            ) : null}
            {games.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {games.map((resource) => (
                  <div
                    key={resource.id}
                    className="rounded-xl border border-border p-3"
                  >
                    <p className="font-medium">{resource.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {resource.type}
                    </p>
                    <Button asChild size="sm" className="mt-2">
                      <Link href={`/student/resources?open=${resource.id}`}>
                        Ouvrir le jeu
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
