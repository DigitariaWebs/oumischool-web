"use client";

import {
  StudentErrorCard,
  StudentLoadingCard,
  StudentPageHeader,
} from "../_components/common";
import {
  ProblemSolvingIllustration,
  OnlineLearningIllustration,
} from "../_components/illustrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStudentResources } from "@/hooks/student";
import Link from "next/link";

const miniGames = [
  { title: "Math Addition", href: "/student/games/math-addition" },
  { title: "French Conjugation", href: "/student/games/french-conjugation" },
  { title: "Planets Memory", href: "/student/games/planets-memory" },
];

const integratedLessons = [
  { title: "Fractions", href: "/student/lessons/math-fractions" },
  { title: "Temps verbaux", href: "/student/lessons/french-tenses" },
  { title: "Système solaire", href: "/student/lessons/science-solar-system" },
];

export default function StudentExercisesPage() {
  const resourcesQuery = useStudentResources();
  const games = (resourcesQuery.data ?? []).filter((r) => r.isGame);

  return (
    <div className="flex min-h-full flex-col">
      <StudentPageHeader
        title="Exercices"
        subtitle="Mini-jeux et leçons interactives"
      />

      {/* Header with Illustration */}
      <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent px-3 py-6 md:px-6 md:py-8">
        <div className="grid items-center gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Apprends en jouant
            </h2>
            <p className="mt-3 text-base text-gray-700">
              Mini-jeux amusants pour progresser dans tes matières
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

      <div className="p-4 md:p-6">
        <Tabs defaultValue="mini-games" className="space-y-4">
          <TabsList>
            <TabsTrigger value="mini-games">Mini-jeux</TabsTrigger>
            <TabsTrigger value="lessons">Leçons</TabsTrigger>
          </TabsList>

          <TabsContent value="mini-games" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mini-jeux intégrés</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {miniGames.map((game) => (
                  <Button
                    key={game.href}
                    asChild
                    variant="outline"
                    className="justify-start"
                  >
                    <Link href={game.href}>{game.title}</Link>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Jeux depuis les ressources
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Leçons intégrées</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {integratedLessons.map((lesson) => (
                  <Button
                    key={lesson.href}
                    asChild
                    variant="outline"
                    className="justify-start"
                  >
                    <Link href={lesson.href}>{lesson.title}</Link>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
