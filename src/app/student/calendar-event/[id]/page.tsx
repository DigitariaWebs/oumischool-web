"use client";

import { ResourceViewer } from "../../_components/ResourceViewer";
import {
  StudentErrorCard,
  StudentLoadingCard,
  StudentPageHeader,
} from "../../_components/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useMarkStudentCalendarEventDone,
  useStudentCalendarEventDetail,
} from "@/hooks/student";
import { StudentResource } from "@/hooks/student/api";
import {
  computeDurationMinutes,
  getScheduleSourceLabel,
} from "@/lib/student-utils";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function StudentCalendarEventDetailPage() {
  const params = useParams<{ id: string }>();
  const id = String(params.id ?? "");
  const query = useStudentCalendarEventDetail(id);
  const markDone = useMarkStudentCalendarEventDone(id);
  const [selectedResource, setSelectedResource] =
    useState<StudentResource | null>(null);

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
              <div className="flex items-start justify-between gap-3">
                <CardTitle>{query.data.title}</CardTitle>
                <Badge variant="secondary">
                  {getScheduleSourceLabel("self_directed")}
                </Badge>
              </div>
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
                    <Button
                      key={resource.id}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setSelectedResource(resource)}
                    >
                      {resource.title}
                    </Button>
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

      <Dialog
        open={!!selectedResource}
        onOpenChange={(open) =>
          setSelectedResource(open ? selectedResource : null)
        }
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedResource?.title}</DialogTitle>
            <DialogDescription>Aperçu de la ressource</DialogDescription>
          </DialogHeader>
          {selectedResource && <ResourceViewer resource={selectedResource} />}
          <Button variant="outline" onClick={() => setSelectedResource(null)}>
            Fermer
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
