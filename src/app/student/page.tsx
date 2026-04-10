"use client";

import {
  StudentEmptyCard,
  StudentErrorCard,
  StudentLoadingCard,
  StudentPageHeader,
} from "./_components/common";
import { resolveDashboardUiState } from "./dashboard-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useStudentAssignedLessons,
  useStudentCalendarEvents,
  useStudentRecommendations,
  useStudentSessions,
} from "@/hooks/student";
import {
  computeDurationMinutes,
  filterScheduleItemsByView,
  getNextLesson,
  getSubjectColor,
  mergeScheduleItems,
  StudentScheduleItem,
} from "@/lib/student-utils";
import { useAuthStore } from "@/store/auth";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Sparkles,
  Trophy,
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
  const childId = user?.id ?? "";
  const sessionsQuery = useStudentSessions();
  const eventsQuery = useStudentCalendarEvents();
  const lessonsQuery = useStudentAssignedLessons();
  const recommendationsQuery = useStudentRecommendations(childId);

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

  return (
    <div className="flex min-h-full flex-col">
      <StudentPageHeader
        title={`Salut ${user?.name ?? user?.firstName ?? "champion"} 👋`}
        subtitle="Ton espace d’apprentissage OumiSchool"
      />

      <div className="space-y-4 p-3 md:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-primary/10 via-background to-background shadow-sm">
            <CardContent className="py-4">
              <p className="text-xs text-muted-foreground">Sessions à venir</p>
              <p className="mt-1 text-2xl font-semibold text-primary">
                {upcomingCount}
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardContent className="py-4">
              <p className="text-xs text-muted-foreground">Leçons assignées</p>
              <p className="mt-1 text-2xl font-semibold">
                {lessonsQuery.data?.length ?? 0}
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardContent className="py-4">
              <p className="text-xs text-muted-foreground">Objectif semaine</p>
              <p className="mt-1 flex items-center gap-1 text-lg font-semibold">
                <Trophy className="h-4 w-4 text-primary" />3 activités
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Prochain cours / session autonome
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {!nextLesson ? (
              <p className="text-sm text-muted-foreground">
                Aucun cours planifié pour le moment.
              </p>
            ) : (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 md:p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {nextLesson.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(nextLesson.startTime).toLocaleString("fr-FR")} •{" "}
                      {computeDurationMinutes(
                        nextLesson.startTime,
                        nextLesson.endTime,
                      )}{" "}
                      min
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-background px-2 py-1 text-xs text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" />
                      {nextLesson.source === "self_directed"
                        ? "Session autonome"
                        : "Session encadrée"}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {nextLesson.meetingLink ? (
                      <Button asChild className="h-10 px-4">
                        <a
                          href={nextLesson.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Rejoindre le cours en ligne"
                        >
                          Rejoindre
                        </a>
                      </Button>
                    ) : null}
                    {nextLesson.source === "self_directed" ? (
                      <Button variant="outline" asChild className="h-10 px-4">
                        <Link href={`/student/calendar-event/${nextLesson.id}`}>
                          Voir le détail
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="outline" asChild className="h-10 px-4">
                        <Link href={`/student/sessions/${nextLesson.id}`}>
                          Voir la session
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-base">Emploi du temps</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={mode === "day" ? "default" : "outline"}
                  size="sm"
                  className="h-9 min-w-16"
                  onClick={() => setMode("day")}
                  aria-label="Afficher en mode jour"
                >
                  Jour
                </Button>
                <Button
                  variant={mode === "week" ? "default" : "outline"}
                  size="sm"
                  className="h-9 min-w-16"
                  onClick={() => setMode("week")}
                  aria-label="Afficher en mode semaine"
                >
                  Semaine
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
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
              <Badge
                variant="secondary"
                className="h-9 px-3 text-xs md:text-sm"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {selectedDate.toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Badge>
              <Button
                variant="outline"
                size="icon"
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
            {uiState === "empty" ? (
              <StudentEmptyCard
                title="Planning vide"
                description="Aucune session prévue sur cette période."
              />
            ) : null}
            {uiState === "ready" ? (
              <div className="space-y-4">
                {groupedVisibleItems.map(([dayLabel, items]) => (
                  <section key={dayLabel} className="space-y-2">
                    <h3 className="text-sm font-semibold capitalize text-muted-foreground">
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
                          className="block rounded-2xl border border-border p-3 transition hover:bg-muted/50"
                        >
                          <div className="flex gap-3">
                            <div
                              className="mt-0.5 h-12 w-1.5 rounded-full"
                              style={{
                                backgroundColor: getSubjectColor(
                                  item.subjectColor,
                                ),
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="truncate font-medium">
                                  {item.title}
                                </p>
                                <Badge
                                  style={{
                                    backgroundColor: `${getSubjectColor(item.subjectColor)}22`,
                                    color: getSubjectColor(item.subjectColor),
                                  }}
                                >
                                  {item.subject}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(item.startTime).toLocaleTimeString(
                                  "fr-FR",
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                                {" - "}
                                {new Date(item.endTime).toLocaleTimeString(
                                  "fr-FR",
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                                {" • "}
                                {computeDurationMinutes(
                                  item.startTime,
                                  item.endTime,
                                )}{" "}
                                min
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Leçons assignées</CardTitle>
            </CardHeader>
            <CardContent>
              {lessonsQuery.isLoading ? (
                <StudentLoadingCard label="Chargement des leçons..." />
              ) : null}
              {lessonsQuery.isError ? (
                <StudentErrorCard
                  message="Impossible de charger les leçons."
                  onRetry={() => void lessonsQuery.refetch()}
                />
              ) : null}
              {lessonsQuery.data && lessonsQuery.data.length === 0 ? (
                <StudentEmptyCard
                  title="Aucune leçon"
                  description="Tes leçons assignées apparaîtront ici."
                />
              ) : null}
              {lessonsQuery.data && lessonsQuery.data.length > 0 ? (
                <ul className="space-y-2">
                  {lessonsQuery.data.slice(0, 5).map((lesson) => (
                    <li
                      key={lesson.id}
                      className="rounded-lg border border-border p-3"
                    >
                      <p className="font-medium">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {lesson.subject?.name ?? "Matière"}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : null}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Assistant IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Besoin d’un coup de main ? L’assistant IA te proposera bientôt
                un accompagnement personnalisé.
              </p>
              <Button
                variant="outline"
                disabled
                className="h-10 w-full md:w-auto"
                aria-label="Assistant IA bientôt disponible"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Bientôt disponible
              </Button>
              {recommendationsQuery.data &&
              recommendationsQuery.data.length > 0 ? (
                <div className="rounded-lg border border-border p-3 text-sm">
                  Recommandation: {recommendationsQuery.data[0].title}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
