"use client";

import {
  StudentErrorCard,
  StudentLoadingCard,
  StudentPageHeader,
} from "../../_components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useMarkStudentCalendarEventDone,
  useStudentCalendarEventDetail,
} from "@/hooks/student";
import { computeDurationMinutes } from "@/lib/student-utils";
import { useParams } from "next/navigation";

export default function StudentCalendarEventDetailPage() {
  const params = useParams<{ id: string }>();
  const id = String(params.id ?? "");
  const query = useStudentCalendarEventDetail(id);
  const markDone = useMarkStudentCalendarEventDone(id);

  return (
    <div className="flex min-h-full flex-col">
      <StudentPageHeader
        title="Session autonome"
        subtitle="Détail de l’événement"
      />
      <div className="p-3 md:p-6">
        {query.isLoading ? <StudentLoadingCard /> : null}
        {query.isError ? (
          <StudentErrorCard
            message="Impossible de charger l’événement."
            onRetry={() => void query.refetch()}
          />
        ) : null}

        {query.data ? (
          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle>{query.data.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <span className="text-muted-foreground">Date:</span>{" "}
                {new Date(query.data.startTime).toLocaleDateString("fr-FR")}
              </p>
              <p>
                <span className="text-muted-foreground">Heure:</span>{" "}
                {new Date(query.data.startTime).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
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
                {query.data.subject?.name ?? "-"}
              </p>
              <p>
                <span className="text-muted-foreground">Description:</span>{" "}
                {query.data.description ?? "Aucune description"}
              </p>

              <div>
                <p className="mb-2 font-medium">Ressources associées</p>
                <div className="space-y-2">
                  {(query.data.resources ?? []).map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.fileUrl ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded border border-border p-2 hover:bg-muted"
                    >
                      {resource.title}
                    </a>
                  ))}
                </div>
              </div>

              <Button
                onClick={async () => {
                  await markDone.mutateAsync();
                  await query.refetch();
                }}
                disabled={markDone.isPending}
              >
                Marquer terminée
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
