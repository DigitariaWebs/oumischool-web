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
  useStartStudentCalendarEvent,
  useStudentCalendarEventDetail,
} from "@/hooks/student";
import { StudentResource, studentApi } from "@/hooks/student/api";
import {
  computeDurationMinutes,
  getStatusBadgeClasses,
  getStatusLabel,
} from "@/lib/student-utils";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Lock,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

// Note: reading from localStorage must happen after mount to avoid SSR
// hydration mismatch — this is the canonical pattern, and the rule is
// disabled locally on the hydration effect only.

const STORAGE_KEY_PREFIX = "student:self-directed:viewed:";

function loadViewed(id: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return new Set(parsed.map(String));
    return new Set();
  } catch {
    return new Set();
  }
}

function saveViewed(id: string, viewed: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      `${STORAGE_KEY_PREFIX}${id}`,
      JSON.stringify(Array.from(viewed)),
    );
  } catch {
    /* ignore quota errors */
  }
}

export default function StudentCalendarEventDetailPage() {
  const params = useParams<{ id: string }>();
  const id = String(params.id ?? "");
  const query = useStudentCalendarEventDetail(id);
  const startMutation = useStartStudentCalendarEvent(id);
  const markDone = useMarkStudentCalendarEventDone(id);

  const [selectedResource, setSelectedResource] =
    useState<StudentResource | null>(null);
  const [viewed, setViewed] = useState<Set<string>>(() => new Set());

  // Hydrate viewed set from localStorage once we know the event id.
  // Done in an effect (not a lazy initializer) to avoid SSR/client mismatch.
  useEffect(() => {
    if (!id) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setViewed(loadViewed(id));
  }, [id]);

  const resources = useMemo(
    () => query.data?.resources ?? [],
    [query.data?.resources],
  );
  const totalResources = resources.length;
  const viewedCount = useMemo(
    () => resources.filter((r) => viewed.has(r.id)).length,
    [resources, viewed],
  );
  const progressPct =
    totalResources === 0 ? 0 : Math.round((viewedCount / totalResources) * 100);

  const statusRaw = String(query.data?.status ?? "SCHEDULED").toUpperCase();
  const isCompleted = statusRaw === "COMPLETED" || statusRaw === "DONE";
  const isInProgress = statusRaw === "IN_PROGRESS" || viewedCount > 0;

  const markResourceViewed = (resourceId: string) => {
    setViewed((prev) => {
      if (prev.has(resourceId)) return prev;
      const next = new Set(prev);
      next.add(resourceId);
      saveViewed(id, next);
      return next;
    });
  };

  const openResource = (resource: StudentResource) => {
    setSelectedResource(resource);
    markResourceViewed(resource.id);
  };

  const handleStart = async () => {
    await startMutation.mutateAsync().catch(() => undefined);
    await query.refetch();
  };

  const handleComplete = async () => {
    await markDone.mutateAsync().catch(() => undefined);
    await query.refetch();
  };

  return (
    <div className="flex min-h-full flex-col bg-background">
      <StudentPageHeader
        title="Leçon autonome"
        subtitle="Détail de la leçon assignée"
      />

      <div className="mx-auto w-full max-w-4xl space-y-5 p-4 md:p-8">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 w-fit rounded-lg text-xs text-muted-foreground"
        >
          <Link href="/student/lessons">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            Retour aux leçons
          </Link>
        </Button>

        {query.isLoading ? (
          <StudentLoadingCard label="Chargement de la leçon..." />
        ) : null}
        {query.isError ? (
          <StudentErrorCard
            message="Impossible de charger la leçon."
            onRetry={() => void query.refetch()}
          />
        ) : null}

        {query.data ? (
          <>
            {/* Main info card */}
            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader className="gap-3 pb-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <CardTitle className="text-xl font-semibold tracking-tight">
                      {query.data.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {query.data.description ?? "Aucune description"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${getStatusBadgeClasses(
                      statusRaw,
                    )}`}
                  >
                    {getStatusLabel(statusRaw)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Meta grid */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <InfoTile
                    icon={CalendarDays}
                    label="Date"
                    value={new Date(query.data.startTime).toLocaleDateString(
                      "fr-FR",
                      { weekday: "long", day: "2-digit", month: "long" },
                    )}
                  />
                  <InfoTile
                    icon={Clock}
                    label="Créneau"
                    value={`${new Date(query.data.startTime).toLocaleTimeString(
                      "fr-FR",
                      { hour: "2-digit", minute: "2-digit" },
                    )} · ${computeDurationMinutes(
                      query.data.startTime,
                      query.data.endTime,
                    )} min`}
                  />
                  <InfoTile
                    icon={BookOpen}
                    label="Matière"
                    value={query.data.subject?.name ?? "—"}
                  />
                </div>

                {/* Progress bar */}
                <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Progression
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {viewedCount} / {totalResources} ressources
                    </p>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border/60">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {isCompleted
                      ? "Leçon terminée — bravo !"
                      : progressPct === 0
                        ? "Clique sur une ressource pour commencer."
                        : `Tu as consulté ${progressPct}% des ressources.`}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2">
                  {!isCompleted && !isInProgress ? (
                    <Button
                      onClick={handleStart}
                      disabled={startMutation.isPending}
                      className="h-9 rounded-lg"
                    >
                      <PlayCircle className="mr-1.5 h-4 w-4" />
                      {startMutation.isPending
                        ? "Démarrage..."
                        : "Commencer la leçon"}
                    </Button>
                  ) : null}
                  {!isCompleted ? (
                    <Button
                      onClick={handleComplete}
                      disabled={markDone.isPending}
                      variant={isInProgress ? "default" : "outline"}
                      className="h-9 rounded-lg"
                    >
                      <CheckCircle2 className="mr-1.5 h-4 w-4" />
                      {markDone.isPending
                        ? "Validation..."
                        : "Marquer comme terminée"}
                    </Button>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="h-8 rounded-lg px-3 text-xs"
                    >
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                      Terminée
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Lesson materials */}
            {query.data.lesson ? (
              <Card className="rounded-2xl border-border/70 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base font-semibold">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        {query.data.lesson.title}
                      </CardTitle>
                      {query.data.lesson.description ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {query.data.lesson.description}
                        </p>
                      ) : null}
                    </div>
                    <Badge
                      variant="outline"
                      className="shrink-0 rounded-full border-border/70 text-[10px] text-muted-foreground"
                    >
                      Leçon
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {query.data.lesson.materials.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Aucun matériel dans cette leçon.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {query.data.lesson.materials.map((material, idx) => {
                        const canOpen =
                          !material.locked && !!material.resourceId;
                        return (
                          <li key={material.id}>
                            <button
                              type="button"
                              onClick={async () => {
                                if (!canOpen || !material.resourceId) return;
                                try {
                                  const resource = await studentApi.resource(
                                    material.resourceId,
                                  );
                                  setSelectedResource(resource);
                                } catch {
                                  /* ignore */
                                }
                              }}
                              disabled={!canOpen}
                              className="flex w-full items-center gap-3 rounded-xl border border-border/70 bg-background p-3 text-left transition enabled:hover:border-primary/40 enabled:hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                                  material.locked
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {material.locked ? (
                                  <Lock className="h-4 w-4" />
                                ) : (
                                  idx + 1
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-foreground">
                                  {material.title}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {material.locked
                                    ? "Ressource non débloquée"
                                    : material.resourceId
                                      ? "Clique pour ouvrir"
                                      : "Aucune ressource liée"}
                                </p>
                              </div>
                              {material.locked ? (
                                <Badge
                                  variant="outline"
                                  className="shrink-0 rounded-full border-amber-300/70 bg-amber-50 text-[10px] text-amber-700"
                                >
                                  Verrouillé
                                </Badge>
                              ) : null}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ) : null}

            {/* Resources list */}
            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Ressources à étudier
                </CardTitle>
              </CardHeader>
              <CardContent>
                {totalResources === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      Aucune ressource associée
                    </p>
                    <p className="max-w-xs text-xs text-muted-foreground">
                      Tes parents n&apos;ont pas encore ajouté de ressource à
                      cette leçon.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {resources.map((resource, idx) => {
                      const seen = viewed.has(resource.id);
                      return (
                        <li key={resource.id}>
                          <button
                            type="button"
                            onClick={() => openResource(resource)}
                            className="flex w-full items-center gap-3 rounded-xl border border-border/70 bg-background p-3 text-left transition hover:border-primary/40 hover:bg-muted/40"
                          >
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                                seen
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {seen ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                idx + 1
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-foreground">
                                {resource.title}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {resource.description ??
                                  "Ressource pédagogique"}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="shrink-0 rounded-full border-border/70 text-[10px] text-muted-foreground"
                            >
                              {seen ? "Vue" : "À lire"}
                            </Badge>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      <Dialog
        open={!!selectedResource}
        onOpenChange={(open) =>
          setSelectedResource(open ? selectedResource : null)
        }
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedResource?.title}</DialogTitle>
            <DialogDescription>
              {selectedResource?.description ?? "Aperçu de la ressource"}
            </DialogDescription>
          </DialogHeader>
          {selectedResource && <ResourceViewer resource={selectedResource} />}
          <Button
            variant="outline"
            onClick={() => setSelectedResource(null)}
            className="h-9 rounded-lg"
          >
            Fermer
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-background p-3">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1 text-sm font-medium capitalize text-foreground">
        {value}
      </p>
    </div>
  );
}
