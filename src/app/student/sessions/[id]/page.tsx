"use client";

import {
  StudentErrorCard,
  StudentLoadingCard,
  StudentPageHeader,
} from "../../_components/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentSessionDetail } from "@/hooks/student";
import {
  computeDurationMinutes,
  getSessionModeLabel,
  getStatusBadgeClasses,
  getStatusLabel,
} from "@/lib/student-utils";
import { Video } from "lucide-react";
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
              <div className="flex items-start justify-between gap-3">
                <CardTitle>{query.data.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${getStatusBadgeClasses(
                      query.data.status,
                    )}`}
                  >
                    {getStatusLabel(query.data.status)}
                  </span>
                  <Badge variant="secondary">
                    {getSessionModeLabel(query.data.mode)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
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
                <span className="text-muted-foreground">Matière:</span>{" "}
                {query.data.subject?.name ?? query.data.subjectName ?? "-"}
              </p>
              <p>
                <span className="text-muted-foreground">Intervenant:</span>{" "}
                {query.data.tutor?.name ??
                  (`${query.data.tutor?.firstName ?? ""} ${query.data.tutor?.lastName ?? ""}`.trim() ||
                    "-")}
              </p>
              <p>
                <span className="text-muted-foreground">Prix:</span>{" "}
                {query.data.price ?? 0} €
              </p>

              {String(query.data.status ?? "").toUpperCase() === "SCHEDULED" &&
              query.data.meetingLink ? (
                <Button asChild className="mt-2">
                  <a
                    href={query.data.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Rejoindre la session
                  </a>
                </Button>
              ) : String(query.data.status ?? "").toUpperCase() ===
                "SCHEDULED" ? (
                <p className="rounded-md border border-border bg-muted/40 p-2 text-xs text-muted-foreground">
                  Le lien de meeting n’est pas encore disponible. Merci de
                  patienter — ton tuteur l’ajoutera bientôt.
                </p>
              ) : null}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
