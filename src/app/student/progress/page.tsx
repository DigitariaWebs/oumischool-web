"use client";

import {
  StudentEmptyCard,
  StudentErrorCard,
  StudentLoadingCard,
  StudentPageHeader,
} from "../_components/common";
import {
  ProblemSolvingIllustration,
  MentalHealthIllustration,
} from "../_components/illustrations";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentActivities, useStudentPerformance } from "@/hooks/student";
import { computeBadges, getStatusLabel } from "@/lib/student-utils";

export default function StudentProgressPage() {
  const performanceQuery = useStudentPerformance();
  const activitiesQuery = useStudentActivities(10);

  if (performanceQuery.isLoading || activitiesQuery.isLoading) {
    return (
      <div className="p-4 md:p-6">
        <StudentLoadingCard label="Chargement des progrès..." />
      </div>
    );
  }

  const performance = performanceQuery.data;
  const activities = activitiesQuery.data ?? [];

  const badges = computeBadges({
    attendanceRate: performance?.attendanceRate ?? 0,
    avgScore: performance?.avgScore ?? 0,
    activitiesCount: activities.length,
  });

  return (
    <div className="flex min-h-full flex-col">
      <StudentPageHeader title="Progrès" subtitle="Suivi de tes performances" />

      {/* Header with Illustration */}
      <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent px-3 py-6 md:px-6 md:py-8">
        <div className="grid items-center gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Suis tes progrès
            </h2>
            <p className="mt-3 text-base text-gray-700">
              Vois comment tu progresses dans tes études.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <ProblemSolvingIllustration />
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-3 md:grid-cols-2 md:p-6">
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Progression globale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {performanceQuery.isError ? (
              <StudentErrorCard
                message="Impossible de charger le score moyen."
                onRetry={() => void performanceQuery.refetch()}
              />
            ) : performance ? (
              <>
                <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border-8 border-primary/20 text-2xl font-bold text-primary">
                  {Math.round(performance.avgScore)}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Score moyen actuel
                </p>
              </>
            ) : (
              <StudentEmptyCard
                title="Aucune donnée"
                description="Les informations de progression ne sont pas encore disponibles."
              />
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Badges</CardTitle>
          </CardHeader>
          <CardContent>
            {performanceQuery.isError || activitiesQuery.isError ? (
              <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                Certaines données sont indisponibles, mais le reste de la page
                reste consultable.
              </div>
            ) : null}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div
                className={
                  badges.attendance70 ? "text-primary" : "text-muted-foreground"
                }
              >
                Présence ≥ 70%
              </div>
              <div
                className={
                  badges.score60 ? "text-primary" : "text-muted-foreground"
                }
              >
                Score ≥ 60%
              </div>
              <div
                className={
                  badges.score85 ? "text-primary" : "text-muted-foreground"
                }
              >
                Score ≥ 85%
              </div>
              <div
                className={
                  badges.activities5 ? "text-primary" : "text-muted-foreground"
                }
              >
                Activités ≥ 5
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Progression par matière</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {performanceQuery.isError ? (
              <StudentErrorCard
                message="Impossible de charger la progression par matière."
                onRetry={() => void performanceQuery.refetch()}
              />
            ) : (performance?.subjectProgress ?? []).length > 0 ? (
              (performance?.subjectProgress ?? []).map((item) => (
                <div key={item.subject}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span>{item.subject}</span>
                    <span>{item.score}%</span>
                  </div>
                  <div className="h-2 rounded bg-muted">
                    <div
                      className="h-2 rounded bg-primary"
                      style={{
                        width: `${Math.max(0, Math.min(100, item.score))}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <StudentEmptyCard
                title="Aucune matière"
                description="La progression détaillée par matière sera visible ici dès que des données seront disponibles."
              />
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Activités récentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activitiesQuery.isError ? (
              <StudentErrorCard
                message="Impossible de charger les activités récentes."
                onRetry={() => void activitiesQuery.refetch()}
              />
            ) : activities.length > 0 ? (
              <div className="space-y-3">
                {activities.map((activity) => {
                  const hasScore =
                    typeof activity.score === "number" && activity.score >= 0;
                  const displayType = activity.type || "Activité";
                  const displaySubject = activity.subject || "Matière";
                  const activityDate = new Date(
                    activity.createdAt,
                  ).toLocaleDateString("fr-FR");

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start justify-between rounded-lg border border-border/50 bg-linear-to-r from-primary/5 to-transparent p-3 hover:border-border/80 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge
                            variant="secondary"
                            className="capitalize text-xs"
                          >
                            {displayType}
                          </Badge>
                          {hasScore && (
                            <span className="text-sm font-semibold text-primary">
                              {activity.score}%
                            </span>
                          )}
                          {activity.status && (
                            <span className="text-xs text-muted-foreground">
                              ({getStatusLabel(activity.status)})
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {displaySubject} • {activityDate}
                        </p>
                        {activity.title && activity.title !== displayType && (
                          <p className="text-xs mt-1 text-foreground/70">
                            {activity.title}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <StudentEmptyCard
                title="Aucune activité"
                description="Les activités récentes apparaîtront ici."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
