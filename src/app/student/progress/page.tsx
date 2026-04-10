"use client";

import {
  StudentErrorCard,
  StudentLoadingCard,
  StudentPageHeader,
} from "../_components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentActivities, useStudentPerformance } from "@/hooks/student";
import { computeBadges } from "@/lib/student-utils";
import { useAuthStore } from "@/store/auth";

export default function StudentProgressPage() {
  const childId = useAuthStore((s) => s.user?.id ?? "");
  const performanceQuery = useStudentPerformance(childId);
  const activitiesQuery = useStudentActivities(childId, 10);

  if (performanceQuery.isLoading || activitiesQuery.isLoading) {
    return (
      <div className="p-4 md:p-6">
        <StudentLoadingCard label="Chargement des progrès..." />
      </div>
    );
  }

  if (performanceQuery.isError || activitiesQuery.isError) {
    return (
      <div className="p-4 md:p-6">
        <StudentErrorCard
          message="Impossible de charger les données de progrès."
          onRetry={() => {
            void performanceQuery.refetch();
            void activitiesQuery.refetch();
          }}
        />
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
      <div className="grid gap-4 p-3 md:grid-cols-2 md:p-6">
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Progression globale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border-8 border-primary/20 text-2xl font-bold text-primary">
              {Math.round(performance?.avgScore ?? 0)}%
            </div>
            <p className="text-sm text-muted-foreground">Score moyen actuel</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Badges</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-sm">
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
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Progression par matière</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(performance?.subjectProgress ?? []).map((item) => (
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
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Activités récentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-lg border border-border p-2"
              >
                <p className="font-medium">{activity.type}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.subject ?? "Matière"} •{" "}
                  {new Date(activity.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
