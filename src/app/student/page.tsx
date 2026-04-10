"use client";

import {
  StudentEmptyCard,
  StudentErrorCard,
  StudentLoadingCard,
  StudentPageHeader,
} from "./_components/common";
import {
  EmptyScheduleIllustration,
  EmptyLessonsIllustration,
  OnlineLearningIllustration,
} from "./_components/illustrations";
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
  getScheduleSourceLabel,
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
  Flame,
  GraduationCap,
  HeartPulse,
  ListChecks,
  NotebookPen,
  Sparkles,
  Trophy,
  Activity,
  BookOpen,
  TrendingUp,
  Settings,
  HelpCircle,
  Zap,
  MapPin,
  CheckCircle2,
  Rocket,
  Target,
  Award,
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
        title={`Salut ${user?.name ?? user?.firstName ?? "champion"}`}
        subtitle="Bienvenue dans ton espace d'apprentissage OumiSchool"
      />

      {/* Welcome Section with Illustration */}
      <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent px-3 py-6 md:px-6 md:py-8">
        <div className="grid items-center gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Bienvenue sur OumiSchool
            </h2>
            <p className="mt-3 text-base text-gray-700">
              Acc&egrave;de à tes cours, leçons et ressources. Travaille à ton
              rythme avec l&apos;aide de tes tuteurs.
            </p>
            <div className="mt-4 flex gap-3">
              <Button asChild>
                <Link href="/student/resources">Voir mes ressources</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/student/progress">Mes progrès</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <img
              src="/Online learning-bro.svg"
              alt="Apprentissage en ligne"
              className="h-56 w-56 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="space-y-6 p-4 md:p-8 lg:grid lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)] lg:items-start lg:gap-6 lg:space-y-0">
        <div className="space-y-8">
          {/* Stats Cards - 2 colors only */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="overflow-hidden rounded-3xl border-0 shadow-lg transition-all hover:shadow-2xl hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardContent className="py-6 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Sessions à venir
                    </p>
                    <p className="mt-3 text-4xl font-bold text-primary">
                      {upcomingCount}
                    </p>
                  </div>
                  <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-200 dark:bg-blue-800">
                    <CalendarDays className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-3xl border-0 shadow-lg transition-all hover:shadow-2xl hover:scale-105 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
              <CardContent className="py-6 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Leçons assignées
                    </p>
                    <p className="mt-3 text-4xl font-bold text-emerald-600">
                      {lessonsQuery.data?.length ?? 0}
                    </p>
                  </div>
                  <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-200 dark:bg-emerald-800">
                    <BookOpen className="h-8 w-8 text-emerald-600 dark:text-emerald-300" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-3xl border-0 shadow-lg transition-all hover:shadow-2xl hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardContent className="py-6 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Objectif semaine
                    </p>
                    <p className="mt-3 text-4xl font-bold text-blue-600">3</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      activités
                    </p>
                  </div>
                  <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-200 dark:bg-blue-800">
                    <Target className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
            <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-emerald-50 dark:from-emerald-950 dark:to-emerald-950">
              <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
                Prochain cours
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {!nextLesson ? (
                <EmptyScheduleIllustration />
              ) : (
                <div className="rounded-3xl border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-emerald-50 dark:from-emerald-900/20 dark:to-emerald-900/20 p-6">
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <p className="text-xl font-bold text-gray-800 dark:text-white">
                          {nextLesson.title}
                        </p>
                        <Badge className="rounded-full bg-emerald-500 text-white font-semibold">
                          {getScheduleSourceLabel(nextLesson.source)}
                        </Badge>
                      </div>
                      <p className="mt-2 text-base text-gray-700 dark:text-gray-300 font-medium">
                        {new Date(nextLesson.startTime).toLocaleString("fr-FR")}{" "}
                        •{" "}
                        {computeDurationMinutes(
                          nextLesson.startTime,
                          nextLesson.endTime,
                        )}{" "}
                        min
                      </p>
                      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700">
                        <Clock3 className="h-5 w-5 text-emerald-600" />
                        {nextLesson.source === "self_directed"
                          ? "À faire en autonomie"
                          : "Session encadrée"}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 pt-4 md:pt-0">
                      {nextLesson.meetingLink ? (
                        <Button
                          asChild
                          className="h-12 px-6 text-base font-semibold rounded-xl"
                        >
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
                        <Button
                          variant="outline"
                          asChild
                          className="h-12 px-6 text-base font-semibold rounded-xl"
                        >
                          <Link
                            href={`/student/calendar-event/${nextLesson.id}`}
                          >
                            Détails
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          asChild
                          className="h-12 px-6 text-base font-semibold rounded-xl"
                        >
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

          <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
            <CardHeader className="gap-4 bg-gradient-to-r from-blue-50 to-blue-50 dark:from-blue-950 dark:to-blue-950 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
                  Emploi du temps
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={mode === "day" ? "default" : "outline"}
                    size="sm"
                    className="h-10 min-w-16 rounded-lg font-semibold"
                    onClick={() => setMode("day")}
                    aria-label="Afficher en mode jour"
                  >
                    Jour
                  </Button>
                  <Button
                    variant={mode === "week" ? "default" : "outline"}
                    size="sm"
                    className="h-10 min-w-16 rounded-lg font-semibold"
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
                  className="h-10 w-10 rounded-lg"
                  onClick={() =>
                    setSelectedDate((prev) => {
                      const next = new Date(prev);
                      next.setDate(prev.getDate() - (mode === "week" ? 7 : 1));
                      return next;
                    })
                  }
                  aria-label="Période précédente"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Badge
                  variant="secondary"
                  className="h-10 px-4 text-sm font-semibold"
                >
                  <CalendarDays className="mr-2 h-5 w-5" />
                  {selectedDate.toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </Badge>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-lg"
                  onClick={() =>
                    setSelectedDate((prev) => {
                      const next = new Date(prev);
                      next.setDate(prev.getDate() + (mode === "week" ? 7 : 1));
                      return next;
                    })
                  }
                  aria-label="Période suivante"
                >
                  <ChevronRight className="h-5 w-5" />
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
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <OnlineLearningIllustration />
                  <h3 className="mt-6 text-lg font-semibold text-gray-800">
                    Aucune session prévue
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-gray-600">
                    Ton planning est vide pour cette période
                  </p>
                </div>
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
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="secondary">
                                      {getScheduleSourceLabel(item.source)}
                                    </Badge>
                                    <Badge
                                      style={{
                                        backgroundColor: `${getSubjectColor(
                                          item.subjectColor,
                                        )}22`,
                                        color: getSubjectColor(
                                          item.subjectColor,
                                        ),
                                      }}
                                    >
                                      {item.subject}
                                    </Badge>
                                  </div>
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

          <div className="grid gap-6 lg:grid-cols-1">
            <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-50 dark:from-emerald-950 dark:to-emerald-950 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white">
                  <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  Assistant IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Besoin d&apos;un coup de main ? L&apos;assistant IA te
                  proposera bientôt un accompagnement personnalisé.
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

        <aside className="space-y-6 lg:sticky lg:top-6">
          <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-50 dark:from-blue-950 dark:to-blue-950 pb-4">
              <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
                Résumé rapide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 md:p-6">
              <div className="rounded-3xl border-0 bg-gradient-to-br from-blue-50 to-blue-50 dark:from-blue-950 dark:to-blue-950 p-6 shadow-md">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Période actuelle
                </p>
                <p className="mt-3 text-5xl font-black text-blue-600 dark:text-blue-400">
                  {upcomingCount}
                </p>
                <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  activités visibles
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border-0 bg-gradient-to-br from-emerald-50 to-emerald-50 dark:from-emerald-950 dark:to-emerald-950 p-4 shadow-md transition-all hover:shadow-lg hover:scale-105">
                  <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  <p className="mt-3 text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                    {lessonsQuery.data?.length ?? 0}
                  </p>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    leçons
                  </p>
                </div>
                <div className="rounded-2xl border-0 bg-gradient-to-br from-blue-50 to-blue-50 dark:from-blue-950 dark:to-blue-950 p-4 shadow-md transition-all hover:shadow-lg hover:scale-105">
                  <HeartPulse className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <p className="mt-3 text-3xl font-bold text-blue-700 dark:text-blue-300">
                    94%
                  </p>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    présence cible
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-50 dark:from-blue-950 dark:to-blue-950 pb-4">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 md:p-6">
              <Button
                asChild
                className="h-12 w-full justify-start rounded-xl text-base font-semibold"
              >
                <Link href="/student/resources">
                  <ListChecks className="mr-3 h-5 w-5" />
                  Ouvrir la bibliothèque
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 w-full justify-start rounded-xl text-base font-semibold"
              >
                <Link href="/student/progress">
                  <TrendingUp className="mr-3 h-5 w-5" />
                  Voir les progrès
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 w-full justify-start rounded-xl text-base font-semibold"
              >
                <Link href="/student/settings">
                  <Settings className="mr-3 h-5 w-5" />
                  Paramètres
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 pb-4">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white">
                <HelpCircle className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                Besoin d&apos;aide ?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 md:p-6 text-sm">
              <div className="rounded-xl bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 p-3">
                <p className="text-xs font-semibold text-orange-900 dark:text-orange-100 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Sessions encadrées
                </p>
                <p className="text-xs text-orange-800 dark:text-orange-200 mt-1">
                  Proposées par l&apos;équipe pédagogique
                </p>
              </div>
              <div className="rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-3">
                <p className="text-xs font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Sessions autonomes
                </p>
                <p className="text-xs text-green-800 dark:text-green-200 mt-1">
                  Clairement signalées dans le planning
                </p>
              </div>
              <div className="rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3">
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                  <Rocket className="h-4 w-4" />
                  Mon conseil
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                  Complète tes leçons pour progresser !
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Exploration Section with Illustrations */}
      <section className="border-t border-border/50 px-3 py-10 md:px-6 md:py-16">
        <h2 className="text-4xl font-black text-gray-800 dark:text-white">
          Explorer plus
        </h2>
        <p className="mt-3 text-lg font-medium text-gray-600 dark:text-gray-400">
          Découvre toutes les ressources disponibles
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Learning Section */}
          <Card className="overflow-hidden rounded-3xl border-0 shadow-lg transition-all hover:shadow-2xl hover:scale-105">
            <div className="flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 px-6 py-10">
              <img
                src="/Learning-bro.svg"
                alt="Apprentissage"
                className="h-48 w-48 object-contain"
              />
              <h3 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white">
                Mes Leçons
              </h3>
              <p className="mt-3 text-center text-base text-gray-700 dark:text-gray-300">
                Tes leçons assignées par tes tuteurs
              </p>
              <Button
                asChild
                className="mt-6 h-12 w-full rounded-xl text-base font-semibold"
              >
                <Link href="/student/lessons">Voir les leçons</Link>
              </Button>
            </div>
          </Card>

          {/* Resources Section */}
          <Card className="overflow-hidden rounded-3xl border-0 shadow-lg transition-all hover:shadow-2xl hover:scale-105">
            <div className="flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950 px-6 py-10">
              <img
                src="/Notebook-amico.svg"
                alt="Ressources"
                className="h-48 w-48 object-contain"
              />
              <h3 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white">
                Ressources
              </h3>
              <p className="mt-3 text-center text-base text-gray-700 dark:text-gray-300">
                PDF, vidéos et fichiers à ton service
              </p>
              <Button
                asChild
                className="mt-6 h-12 w-full rounded-xl text-base font-semibold"
              >
                <Link href="/student/resources">Accéder à la bibliothèque</Link>
              </Button>
            </div>
          </Card>

          {/* Webinars Section */}
          <Card className="overflow-hidden rounded-3xl border-0 shadow-lg transition-all hover:shadow-2xl hover:scale-105">
            <div className="flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950 px-6 py-10">
              <img
                src="/Webinar-cuate.svg"
                alt="Webinaires"
                className="h-48 w-48 object-contain"
              />
              <h3 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white">
                Sessions en Direct
              </h3>
              <p className="mt-3 text-center text-base text-gray-700 dark:text-gray-300">
                Apprends en live avec tes tuteurs
              </p>
              <Button
                asChild
                className="mt-6 h-12 w-full rounded-xl text-base font-semibold"
              >
                <Link href="/student/sessions">Voir les sessions</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
