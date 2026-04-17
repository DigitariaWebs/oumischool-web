"use client";

import {
  StudentErrorCard,
  StudentLoadingCard,
  StudentPageHeader,
} from "./_components/common";
import { resolveDashboardUiState } from "./dashboard-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentCalendarEvents, useStudentSessions } from "@/hooks/student";
import {
  computeDurationMinutes,
  filterScheduleItemsByView,
  getNextLesson,
  getScheduleSourceLabel,
  getStatusBadgeClasses,
  getStatusLabel,
  getSubjectColor,
  mergeScheduleItems,
  StudentScheduleItem,
} from "@/lib/student-utils";
import { useAuthStore } from "@/store/auth";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ListChecks,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

function toScheduleItems(
  sessions: ReturnType<typeof useStudentSessions>["data"] = [],
  events: ReturnType<typeof useStudentCalendarEvents>["data"] = [],
): StudentScheduleItem[] {
  const sessionItems: StudentScheduleItem[] = sessions.map((session) => ({
    id: session.id,
    source: "session",
    title: session.title,
    subject: session.subject?.name ?? session.subjectName ?? "Matière",
    subjectColor: session.subject?.color,
    startTime: session.startTime,
    endTime: session.endTime,
    status: session.status,
    meetingLink: session.meetingLink,
  }));

  const eventItems: StudentScheduleItem[] = events
    .filter(
      (event) => String(event.type ?? "").toLowerCase() === "self_directed",
    )
    .map((event) => ({
      id: event.id,
      source: "self_directed",
      title: event.title,
      subject: event.subject?.name ?? "Session autonome",
      subjectColor: event.subject?.color,
      startTime: event.startTime,
      endTime: event.endTime,
      status: event.status ?? "SCHEDULED",
    }));

  return mergeScheduleItems(sessionItems, eventItems);
}

export default function StudentDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const sessionsQuery = useStudentSessions();
  const eventsQuery = useStudentCalendarEvents();

  const assignedLessonCount = useMemo(
    () =>
      (eventsQuery.data ?? []).filter(
        (e) =>
          String(e.type ?? "").toLowerCase() === "self_directed" && !!e.lesson,
      ).length,
    [eventsQuery.data],
  );

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mode, setMode] = useState<"day" | "week">("week");

  const mergedSchedule = useMemo(
    () => toScheduleItems(sessionsQuery.data, eventsQuery.data),
    [eventsQuery.data, sessionsQuery.data],
  );

  const visibleItems = useMemo(
    () => filterScheduleItemsByView(mergedSchedule, selectedDate, mode),
    [mergedSchedule, mode, selectedDate],
  );

  const nextLesson = useMemo(
    () => getNextLesson(mergedSchedule),
    [mergedSchedule],
  );

  const selfDirectedCount = useMemo(
    () =>
      mergedSchedule.filter((item) => item.source === "self_directed").length,
    [mergedSchedule],
  );

  const groupedVisibleItems = useMemo(() => {
    const grouped = new Map<string, StudentScheduleItem[]>();

    visibleItems.forEach((item) => {
      const key = new Date(item.startTime).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
      });
      const list = grouped.get(key) ?? [];
      list.push(item);
      grouped.set(key, list);
    });

    return Array.from(grouped.entries());
  }, [visibleItems]);

  const upcomingCount = visibleItems.length;

  const isLoading = sessionsQuery.isLoading || eventsQuery.isLoading;
  const isError = sessionsQuery.isError || eventsQuery.isError;
  const uiState = resolveDashboardUiState({
    isLoading,
    isError,
    schedule: mergedSchedule,
  });

  const firstName = user?.firstName ?? user?.name?.split(" ")[0] ?? "champion";

  return (
    <div className="flex min-h-full flex-col bg-background">
      <StudentPageHeader
        title={`Salut ${firstName}`}
        subtitle="Bienvenue dans ton espace d'apprentissage"
      />

      <div className="space-y-6 p-4 md:p-8">
        {/* Hero card */}
        <Card className="overflow-hidden rounded-2xl border-border/70 bg-gradient-to-br from-primary/5 via-background to-background shadow-sm">
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="max-w-xl space-y-3">
              <Badge
                variant="secondary"
                className="rounded-full px-3 py-1 text-[11px] font-medium"
              >
                Espace élève
              </Badge>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Prêt pour ta prochaine leçon ?
              </h2>
              <p className="text-sm text-muted-foreground md:text-base">
                Retrouve tes sessions, tes devoirs assignés par tes parents et
                tes ressources, tout au même endroit.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button asChild size="sm" className="h-9 rounded-lg">
                  <Link href="/student/resources">Voir mes ressources</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="h-9 rounded-lg"
                >
                  <Link href="/student/progress">Mes progrès</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={CalendarDays}
            label="Sessions à venir"
            value={upcomingCount}
            hint={mode === "week" ? "cette semaine" : "aujourd'hui"}
          />
          <StatCard
            icon={BookOpen}
            label="Leçons assignées"
            value={assignedLessonCount}
            hint="à travailler"
          />
          <StatCard
            icon={Target}
            label="Devoirs autonomes"
            value={selfDirectedCount}
            hint="en attente"
          />
        </div>

        {/* Next lesson */}
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Sparkles className="h-4 w-4 text-primary" />
              Prochain cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!nextLesson ? (
              <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Aucun cours prévu
                </p>
                <p className="max-w-xs text-xs text-muted-foreground">
                  Tu n&apos;as rien au programme pour le moment. Profites-en
                  pour revoir tes leçons !
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-border/70 bg-muted/30 p-4 md:p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-foreground">
                        {nextLesson.title}
                      </p>
                      <Badge
                        variant="outline"
                        className="rounded-full border-border/70 text-[11px] font-medium text-muted-foreground"
                      >
                        {getScheduleSourceLabel(nextLesson.source)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(nextLesson.startTime).toLocaleString("fr-FR", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-background px-2 py-1 text-xs text-muted-foreground ring-1 ring-border/70">
                        <Clock3 className="h-3.5 w-3.5" />
                        {computeDurationMinutes(
                          nextLesson.startTime,
                          nextLesson.endTime,
                        )}{" "}
                        min
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs ${getStatusBadgeClasses(
                          nextLesson.status,
                        )}`}
                      >
                        {getStatusLabel(nextLesson.status)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 md:shrink-0">
                    {nextLesson.meetingLink ? (
                      <Button asChild size="sm" className="h-9 rounded-lg">
                        <a
                          href={nextLesson.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Rejoindre
                        </a>
                      </Button>
                    ) : null}
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-9 rounded-lg"
                    >
                      <Link
                        href={
                          nextLesson.source === "self_directed"
                            ? `/student/calendar-event/${nextLesson.id}`
                            : `/student/sessions/${nextLesson.id}`
                        }
                      >
                        Détails
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader className="gap-3 pb-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-base font-semibold">
                Emploi du temps
              </CardTitle>
              <div className="inline-flex rounded-lg border border-border/70 bg-background p-0.5">
                <button
                  onClick={() => setMode("day")}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                    mode === "day"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Afficher en mode jour"
                >
                  Jour
                </button>
                <button
                  onClick={() => setMode("week")}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                    mode === "week"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Afficher en mode semaine"
                >
                  Semaine
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() =>
                  setSelectedDate((prev) => {
                    const next = new Date(prev);
                    next.setDate(prev.getDate() - (mode === "week" ? 7 : 1));
                    return next;
                  })
                }
                aria-label="Période précédente"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-foreground">
                {selectedDate.toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() =>
                  setSelectedDate((prev) => {
                    const next = new Date(prev);
                    next.setDate(prev.getDate() + (mode === "week" ? 7 : 1));
                    return next;
                  })
                }
                aria-label="Période suivante"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {uiState === "loading" ? (
              <StudentLoadingCard label="Chargement du planning..." />
            ) : null}
            {uiState === "error" ? (
              <StudentErrorCard
                message="Impossible de charger le planning."
                onRetry={() => {
                  void sessionsQuery.refetch();
                  void eventsQuery.refetch();
                }}
              />
            ) : null}
            {uiState === "empty" || visibleItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Aucune session prévue
                </p>
                <p className="max-w-xs text-xs text-muted-foreground">
                  Ton planning est vide pour cette période.
                </p>
              </div>
            ) : null}
            {uiState === "ready" && visibleItems.length > 0 ? (
              <div className="space-y-5">
                {groupedVisibleItems.map(([dayLabel, items]) => (
                  <section key={dayLabel} className="space-y-2">
                    <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {dayLabel}
                    </h3>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <Link
                          key={`${item.source}-${item.id}`}
                          href={
                            item.source === "self_directed"
                              ? `/student/calendar-event/${item.id}`
                              : `/student/sessions/${item.id}`
                          }
                          className="group flex items-start gap-3 rounded-xl border border-border/70 bg-background p-3 transition hover:border-primary/40 hover:bg-muted/40"
                        >
                          <div
                            className="mt-1 h-10 w-1 shrink-0 rounded-full"
                            style={{
                              backgroundColor: getSubjectColor(
                                item.subjectColor,
                              ),
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="truncate text-sm font-medium text-foreground">
                                {item.title}
                              </p>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <Badge
                                  variant="outline"
                                  className="rounded-full border-border/70 text-[10px] font-medium text-muted-foreground"
                                >
                                  {getScheduleSourceLabel(item.source)}
                                </Badge>
                                <span
                                  className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${getStatusBadgeClasses(
                                    item.status,
                                  )}`}
                                >
                                  {getStatusLabel(item.status)}
                                </span>
                              </div>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {new Date(item.startTime).toLocaleTimeString(
                                "fr-FR",
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                              {" – "}
                              {new Date(item.endTime).toLocaleTimeString(
                                "fr-FR",
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                              {" · "}
                              {computeDurationMinutes(
                                item.startTime,
                                item.endTime,
                              )}{" "}
                              min · {item.subject}
                            </p>
                          </div>
                          <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Quick links */}
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Explorer</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <QuickLink
              href="/student/resources"
              icon={ListChecks}
              title="Bibliothèque"
              description="Documents, vidéos et ressources"
            />
            <QuickLink
              href="/student/progress"
              icon={TrendingUp}
              title="Mes progrès"
              description="Performance et badges"
            />
            <QuickLink
              href="/student/exercises"
              icon={Sparkles}
              title="Jeux éducatifs"
              description="Apprends en t'amusant"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  hint: string;
}) {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardContent className="flex items-center justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border border-border/70 bg-background p-4 transition hover:border-primary/40 hover:bg-muted/40"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
    </Link>
  );
}
