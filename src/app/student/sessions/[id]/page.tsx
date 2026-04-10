"use client";

import {
  StudentErrorCard,
  StudentLoadingCard,
  StudentPageHeader,
} from "../../_components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentSessionDetail } from "@/hooks/student";
import { computeDurationMinutes } from "@/lib/student-utils";
import { useParams } from "next/navigation";

export default function StudentSessionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = String(params.id ?? "");
  const query = useStudentSessionDetail(id);

  return (
    <div className="flex min-h-full flex-col">
      <StudentPageHeader
        title="Détail session"
        subtitle="Informations de la session"
      />
      <div className="p-3 md:p-6">
        {query.isLoading ? <StudentLoadingCard /> : null}
        {query.isError ? (
          <StudentErrorCard
            message="Impossible de charger la session."
            onRetry={() => void query.refetch()}
          />
        ) : null}
        {query.data ? (
          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle>{query.data.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Statut:</span>{" "}
                {query.data.status}
              </p>
              <p>
                <span className="text-muted-foreground">Mode:</span>{" "}
                {query.data.mode ?? "-"}
              </p>
              <p>
                <span className="text-muted-foreground">Date:</span>{" "}
                {new Date(query.data.startTime).toLocaleString("fr-FR")}
              </p>
              <p>
                <span className="text-muted-foreground">Durée:</span>{" "}
                {computeDurationMinutes(
                  query.data.startTime,
                  query.data.endTime,
                )}{" "}
                min
              </p>
              <p>
                <span className="text-muted-foreground">Prix:</span>{" "}
                {query.data.price ?? 0}
              </p>
              <p>
                <span className="text-muted-foreground">Intervenant:</span>{" "}
                {query.data.tutor?.name ??
                  (`${query.data.tutor?.firstName ?? ""} ${query.data.tutor?.lastName ?? ""}`.trim() ||
                    "-")}
              </p>

              {query.data.meetingLink ? (
                <Button asChild>
                  <a
                    href={query.data.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ouvrir le meeting
                  </a>
                </Button>
              ) : (
                <p className="rounded-md border border-border bg-muted/40 p-2 text-xs text-muted-foreground">
                  Le lien de meeting n’est pas encore disponible. Merci de
                  patienter.
                </p>
              )}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
