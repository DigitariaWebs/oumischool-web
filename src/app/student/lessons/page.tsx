"use client";

import {
  StudentErrorCard,
  StudentLoadingCard,
  StudentPageHeader,
} from "../_components/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useStudentCalendarEvents } from "@/hooks/student";
import type { StudentCalendarEvent } from "@/hooks/student/api";
import {
  computeDurationMinutes,
  getStatusBadgeClasses,
  getStatusLabel,
} from "@/lib/student-utils";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  Lock,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type LessonFilter = "all" | "todo" | "in_progress" | "done";

function isSelfDirected(event: StudentCalendarEvent): boolean {
  return String(event.type ?? "").toLowerCase() === "self_directed";
}

function statusBucket(status: string | null | undefined): LessonFilter {
  const normalized = String(status ?? "")
    .trim()
    .toUpperCase();
  if (normalized === "COMPLETED" || normalized === "DONE") return "done";
  if (normalized === "IN_PROGRESS") return "in_progress";
  return "todo";
}

export default function LessonsPage() {
  const eventsQuery = useStudentCalendarEvents();
  const [filter, setFilter] = useState<LessonFilter>("all");

  const selfDirectedLessons = useMemo(
    () => (eventsQuery.data ?? []).filter(isSelfDirected),
    [eventsQuery.data],
  );

  const counts = useMemo(() => {
    const todo = selfDirectedLessons.filter(
      (l) => statusBucket(l.status) === "todo",
    ).length;
    const inProgress = selfDirectedLessons.filter(
      (l) => statusBucket(l.status) === "in_progress",
    ).length;
    const done = selfDirectedLessons.filter(
      (l) => statusBucket(l.status) === "done",
    ).length;
    return { todo, inProgress, done, total: selfDirectedLessons.length };
  }, [selfDirectedLessons]);

  const filtered = useMemo(() => {
    if (filter === "all") return selfDirectedLessons;
    return selfDirectedLessons.filter((l) => statusBucket(l.status) === filter);
  }, [selfDirectedLessons, filter]);

  const isLoading = eventsQuery.isLoading;
  const isError = eventsQuery.isError;

  return (
    <div className="flex min-h-full flex-col bg-background">
      <StudentPageHeader
        title="Mes leçons"
        subtitle="Les leçons et devoirs assignés par tes parents"
      />

      <div className="space-y-6 p-4 md:p-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Total" value={counts.total} icon={BookOpen} />
          <StatTile label="À commencer" value={counts.todo} icon={Clock} />
          <StatTile
            label="En cours"
            value={counts.inProgress}
            icon={PlayCircle}
          />
          <StatTile label="Terminées" value={counts.done} icon={CheckCircle2} />
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="Toutes"
          />
          <FilterButton
            active={filter === "todo"}
            onClick={() => setFilter("todo")}
            label="À commencer"
          />
          <FilterButton
            active={filter === "in_progress"}
            onClick={() => setFilter("in_progress")}
            label="En cours"
          />
          <FilterButton
            active={filter === "done"}
            onClick={() => setFilter("done")}
            label="Terminées"
          />
        </div>

        {/* List */}
        {isLoading ? (
          <StudentLoadingCard label="Chargement des leçons..." />
        ) : null}
        {isError ? (
          <StudentErrorCard
            message="Impossible de charger tes leçons."
            onRetry={() => void eventsQuery.refetch()}
          />
        ) : null}
        {!isLoading && !isError && filtered.length === 0 ? (
          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                Aucune leçon dans cette catégorie
              </p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Tes parents n&apos;ont pas encore assigné de leçon correspondant
                à ce filtre.
              </p>
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && !isError && filtered.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((lesson) => {
              const duration = computeDurationMinutes(
                lesson.startTime,
                lesson.endTime,
              );
              const resourcesCount = lesson.resources?.length ?? 0;
              const hasLockedMaterial =
                lesson.lesson?.materials.some((m) => m.locked) ?? false;
              return (
                <Link
                  key={lesson.id}
                  href={`/student/calendar-event/${lesson.id}`}
                  className="group"
                >
                  <Card className="h-full rounded-2xl border-border/70 shadow-sm transition hover:border-primary/40 hover:shadow-md">
                    <CardContent className="flex h-full flex-col gap-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${getStatusBadgeClasses(
                            lesson.status,
                          )}`}
                        >
                          {getStatusLabel(lesson.status)}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1 space-y-2">
                        <h3 className="line-clamp-2 text-base font-semibold text-foreground">
                          {lesson.title}
                        </h3>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {lesson.description ?? "Aucune description"}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {lesson.subject?.name ? (
                            <Badge
                              variant="outline"
                              className="rounded-full border-border/70 text-[11px] text-muted-foreground"
                            >
                              {lesson.subject.name}
                            </Badge>
                          ) : null}
                          {resourcesCount > 0 ? (
                            <Badge
                              variant="outline"
                              className="rounded-full border-border/70 text-[11px] text-muted-foreground"
                            >
                              {resourcesCount} ressource
                              {resourcesCount > 1 ? "s" : ""}
                            </Badge>
                          ) : null}
                          {hasLockedMaterial ? (
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1 rounded-full border-amber-300/70 bg-amber-50 text-[11px] text-amber-700"
                            >
                              <Lock className="h-3 w-3" />
                              Verrouillé
                            </Badge>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-border/60 pt-3">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {new Date(lesson.startTime).toLocaleDateString(
                              "fr-FR",
                              { day: "2-digit", month: "short" },
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {duration} min
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardContent className="flex items-center justify-between gap-3 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className="h-9 rounded-lg text-xs font-medium"
    >
      {label}
    </Button>
  );
}
