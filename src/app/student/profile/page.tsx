"use client";

import { StudentPageHeader } from "../_components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useStudentActivities,
  useStudentAssignedLessons,
  useStudentPerformance,
} from "@/hooks/student";
import { computeBadges } from "@/lib/student-utils";
import { useAuthStore } from "@/store/auth";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StudentProfilePage() {
  const router = useRouter();
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const childId = user?.id ?? "";

  const lessonsQuery = useStudentAssignedLessons();
  const activitiesQuery = useStudentActivities(childId, 10);
  const performanceQuery = useStudentPerformance(childId);

  const badges = computeBadges({
    attendanceRate: performanceQuery.data?.attendanceRate ?? 0,
    avgScore: performanceQuery.data?.avgScore ?? 0,
    activitiesCount: activitiesQuery.data?.length ?? 0,
  });

  const totalBadges = Object.values(badges).filter(Boolean).length;

  return (
    <div className="flex min-h-full flex-col">
      <StudentPageHeader title="Profil" subtitle="Tes infos et statistiques" />
      <div className="grid gap-4 p-3 md:grid-cols-2 md:p-6">
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Nom:</span>{" "}
              {user?.name ?? "-"}
            </p>
            <p>
              <span className="text-muted-foreground">Email:</span>{" "}
              {user?.email ?? "-"}
            </p>
            <p>
              <span className="text-muted-foreground">Rôle:</span> Enfant
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Indicateurs clés</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border border-border p-2">
              Leçons: {lessonsQuery.data?.length ?? 0}
            </div>
            <div className="rounded border border-border p-2">
              Activités: {activitiesQuery.data?.length ?? 0}
            </div>
            <div className="rounded border border-border p-2">
              Présence: {Math.round(performanceQuery.data?.attendanceRate ?? 0)}
              %
            </div>
            <div className="rounded border border-border p-2">
              Badges: {totalBadges}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Compte</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" asChild className="h-10">
              <Link href="/student/settings">Accéder aux paramètres</Link>
            </Button>
            <Button
              variant="destructive"
              className="h-10"
              onClick={async () => {
                clear();
                await qc.clear();
                router.replace("/sign-in");
              }}
            >
              Déconnexion
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
