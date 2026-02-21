"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ScheduleView } from "@/components/ui/schedule-view";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getSubjectColor,
  getSubjectName,
  mockLessons,
  mockLessonSeries,
  mockSubjects,
  mockTutors,
  mockSchedules,
} from "@/lib/data/tutors";
import { formatCurrency } from "@/lib/utils";
import { useSettingsStore } from "@/store/settings";
import { Tutor, TutorResource, TutorRevenue } from "@/types";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  GraduationCap,
  Languages,
  Layers as LayersIcon,
  Mail,
  MapPin,
  Mic,
  Monitor,
  Phone,
  PlayCircle,
  Repeat2,
  Tag,
  ShoppingCart,
  Star,
  TrendingUp,
  Users,
  Video,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="w-8 text-right text-xs font-semibold" style={{ color }}>
        {value}%
      </span>
    </div>
  );
}

// ─── Lessons Section ──────────────────────────────────────────────────────────

function TutorLessonsSection({
  tutorId,
  subjectIds,
  color,
}: {
  tutorId: string;
  subjectIds: string[];
  color: string;
}) {
  const subjects = subjectIds
    .map((id) => mockSubjects.find((s) => s.id === id))
    .filter(Boolean) as { id: string; name: string; color: string }[];

  const [activeSubject, setActiveSubject] = useState<string>(
    subjects[0]?.id ?? "",
  );

  const activeColor =
    subjects.find((s) => s.id === activeSubject)?.color ?? color;

  const subjectLessons = mockLessons.filter(
    (l) => l.tutorId === tutorId && l.subjectId === activeSubject,
  );
  const subjectSeries = mockLessonSeries.filter(
    (s) => s.tutorId === tutorId && s.subjectId === activeSubject,
  );
  const standalone = subjectLessons.filter((l) => !l.seriesId);

  return (
    <div className="dash-card overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border/60">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <PlayCircle className="h-4 w-4" style={{ color }} />
          Leçons
        </h2>
        {subjects.length > 1 && (
          <div className="flex gap-1.5 flex-wrap">
            {subjects.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSubject(s.id)}
                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border transition-colors"
                style={
                  activeSubject === s.id
                    ? {
                        background: `${s.color}18`,
                        borderColor: `${s.color}40`,
                        color: s.color,
                      }
                    : {}
                }
              >
                <BookOpen className="h-3 w-3" />
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-5">
        {subjectLessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <PlayCircle className="h-9 w-9 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-foreground">
              Aucune leçon pour cette matière
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Les leçons ajoutées apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Series */}
            {subjectSeries.map((series) => {
              const lessons = subjectLessons
                .filter((l) => l.seriesId === series.id)
                .sort(
                  (a, b) => (a.orderInSeries ?? 0) - (b.orderInSeries ?? 0),
                );
              if (!lessons.length) return null;
              return (
                <div
                  key={series.id}
                  className="rounded-xl overflow-hidden border border-border/60"
                >
                  <div
                    className="flex items-center gap-3 px-4 py-3"
                    style={{ background: `${activeColor}08` }}
                  >
                    <LayersIcon
                      className="h-4 w-4"
                      style={{ color: activeColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {series.title}
                      </p>
                      {series.description && (
                        <p className="text-[11px] text-muted-foreground truncate">
                          {series.description}
                        </p>
                      )}
                    </div>
                    <span
                      className="text-[11px] font-medium rounded-full px-2 py-0.5 shrink-0"
                      style={{
                        background: `${activeColor}18`,
                        color: activeColor,
                      }}
                    >
                      {lessons.length} leçon{lessons.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="divide-y divide-border/40">
                    {lessons.map((lesson, i) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-4 px-4 py-3"
                      >
                        <div
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                          style={{ background: activeColor }}
                        >
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {lesson.title}
                          </p>
                          {lesson.description && (
                            <p className="text-[11px] text-muted-foreground truncate">
                              {lesson.description}
                            </p>
                          )}
                          {lesson.materials && lesson.materials.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {lesson.materials.map((mat) => (
                                <span
                                  key={mat.id}
                                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border"
                                  style={
                                    mat.soldSeparately
                                      ? {
                                          background: "oklch(0.96 0.025 80)",
                                          borderColor: "oklch(0.88 0.08 80)",
                                          color: "oklch(0.48 0.12 80)",
                                        }
                                      : {
                                          background: "oklch(0.95 0.018 155)",
                                          borderColor: "oklch(0.85 0.05 155)",
                                          color: "oklch(0.42 0.12 155)",
                                        }
                                  }
                                >
                                  {mat.soldSeparately ? (
                                    <ShoppingCart className="h-2.5 w-2.5" />
                                  ) : (
                                    <FileText className="h-2.5 w-2.5" />
                                  )}
                                  {mat.title}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0 text-[11px] text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {lesson.duration}
                        </div>
                        {i < lessons.length - 1 && (
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Standalone */}
            {standalone.length > 0 && (
              <div className="rounded-xl overflow-hidden border border-border/60">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60">
                  <PlayCircle className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-semibold text-foreground">
                    Leçons indépendantes
                  </p>
                </div>
                <div className="divide-y divide-border/40">
                  {standalone.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-4 px-4 py-3"
                    >
                      <div
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                        style={{ background: `${activeColor}18` }}
                      >
                        <PlayCircle
                          className="h-3.5 w-3.5"
                          style={{ color: activeColor }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {lesson.title}
                        </p>
                        {lesson.description && (
                          <p className="text-[11px] text-muted-foreground truncate">
                            {lesson.description}
                          </p>
                        )}
                        {lesson.materials && lesson.materials.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {lesson.materials.map((mat) => (
                              <span
                                key={mat.id}
                                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border"
                                style={
                                  mat.soldSeparately
                                    ? {
                                        background: "oklch(0.96 0.025 80)",
                                        borderColor: "oklch(0.88 0.08 80)",
                                        color: "oklch(0.48 0.12 80)",
                                      }
                                    : {
                                        background: "oklch(0.95 0.018 155)",
                                        borderColor: "oklch(0.85 0.05 155)",
                                        color: "oklch(0.42 0.12 155)",
                                      }
                                }
                              >
                                {mat.soldSeparately ? (
                                  <ShoppingCart className="h-2.5 w-2.5" />
                                ) : (
                                  <FileText className="h-2.5 w-2.5" />
                                )}
                                {mat.title}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {lesson.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Revenue Section ──────────────────────────────────────────────────────────

function TutorRevenueSection({
  revenue,
  platformCut,
}: {
  revenue: TutorRevenue;
  platformCut: number;
}) {
  const [openSubject, setOpenSubject] = useState<string | null>(
    revenue.bySubject[0]?.subjectId ?? null,
  );
  const [openSeries, setOpenSeries] = useState<string | null>(null);

  const totalColor = "oklch(0.52 0.14 250)";
  const cutColor = "oklch(0.52 0.18 20)";
  const netColor = "oklch(0.48 0.14 155)";

  const platformAmount = revenue.total * platformCut;
  const tutorNet = revenue.total - platformAmount;

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="dash-card p-5 flex flex-col gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: "oklch(0.93 0.02 250)" }}
          >
            <TrendingUp className="h-4 w-4" style={{ color: totalColor }} />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(revenue.total)}
          </p>
          <p className="text-xs text-muted-foreground">Revenus bruts totaux</p>
        </div>
        <div className="dash-card p-5 flex flex-col gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: "oklch(0.96 0.025 20)" }}
          >
            <ShoppingCart className="h-4 w-4" style={{ color: cutColor }} />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold" style={{ color: cutColor }}>
              {formatCurrency(platformAmount)}
            </p>
            <span
              className="text-xs font-semibold rounded-full px-1.5 py-0.5"
              style={{
                background: "oklch(0.96 0.025 20)",
                color: cutColor,
              }}
            >
              {(platformCut * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Commission plateforme</p>
        </div>
        <div className="dash-card p-5 flex flex-col gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: "oklch(0.95 0.018 155)" }}
          >
            <Award className="h-4 w-4" style={{ color: netColor }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: netColor }}>
            {formatCurrency(tutorNet)}
          </p>
          <p className="text-xs text-muted-foreground">Net tuteur</p>
        </div>
      </div>

      {/* Breakdown by course */}
      <div className="dash-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4" style={{ color: totalColor }} />
            Détail par cours
          </h2>
        </div>

        <div className="divide-y divide-border/40">
          {revenue.bySubject.map((sub) => {
            const subColor = getSubjectColor(sub.subjectId);
            const isSubOpen = openSubject === sub.subjectId;
            const subNet = sub.amount * (1 - platformCut);
            return (
              <div key={sub.subjectId}>
                <button
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors text-left"
                  onClick={() =>
                    setOpenSubject(isSubOpen ? null : sub.subjectId)
                  }
                >
                  <ChevronRight
                    className="h-3.5 w-3.5 shrink-0 transition-transform"
                    style={{
                      color: subColor,
                      transform: isSubOpen ? "rotate(90deg)" : undefined,
                    }}
                  />
                  <BookOpen
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: subColor }}
                  />
                  <span className="flex-1 text-sm font-semibold text-foreground">
                    {getSubjectName(sub.subjectId)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {sub.series.reduce((a, s) => a + s.sales, 0) +
                      sub.standaloneLessons.reduce(
                        (a, l) => a + l.sales,
                        0,
                      )}{" "}
                    ventes
                  </span>
                  <span
                    className="ml-3 text-[11px] font-medium"
                    style={{ color: cutColor }}
                  >
                    -{formatCurrency(sub.amount * platformCut)}
                  </span>
                  <span
                    className="ml-2 text-sm font-bold"
                    style={{ color: subColor }}
                  >
                    {formatCurrency(subNet)}
                  </span>
                </button>

                {isSubOpen && (
                  <div className="border-t border-border/40">
                    {sub.series.map((ser) => {
                      const seriesInfo = mockLessonSeries.find(
                        (s) => s.id === ser.seriesId,
                      );
                      const isSerOpen = openSeries === ser.seriesId;
                      return (
                        <div
                          key={ser.seriesId}
                          className="border-b border-border/30 last:border-0"
                        >
                          <button
                            className="w-full flex items-center gap-3 pl-10 pr-5 py-2.5 hover:bg-muted/20 transition-colors text-left"
                            onClick={() =>
                              setOpenSeries(isSerOpen ? null : ser.seriesId)
                            }
                          >
                            <ChevronRight
                              className="h-3 w-3 shrink-0 text-muted-foreground transition-transform"
                              style={{
                                transform: isSerOpen
                                  ? "rotate(90deg)"
                                  : undefined,
                              }}
                            />
                            <LayersIcon
                              className="h-3.5 w-3.5 shrink-0"
                              style={{ color: subColor }}
                            />
                            <span className="flex-1 text-xs font-semibold text-foreground">
                              {seriesInfo?.title ?? ser.seriesId}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {ser.sales} ventes
                            </span>
                            <span
                              className="ml-2 text-[11px] font-medium"
                              style={{ color: cutColor }}
                            >
                              -{formatCurrency(ser.amount * platformCut)}
                            </span>
                            <span
                              className="ml-2 text-xs font-bold"
                              style={{ color: subColor }}
                            >
                              {formatCurrency(ser.amount * (1 - platformCut))}
                            </span>
                          </button>

                          {isSerOpen && (
                            <div className="bg-muted/20">
                              {ser.lessons.map((les) => {
                                const lessonInfo = mockLessons.find(
                                  (l) => l.id === les.lessonId,
                                );
                                return (
                                  <div
                                    key={les.lessonId}
                                    className="flex items-center gap-3 pl-16 pr-5 py-2 border-t border-border/20"
                                  >
                                    <PlayCircle className="h-3 w-3 shrink-0 text-muted-foreground" />
                                    <span className="flex-1 text-[11px] text-foreground/80">
                                      {lessonInfo?.title ?? les.lessonId}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground">
                                      {les.sales} ventes
                                    </span>
                                    <span
                                      className="ml-2 text-[11px] font-medium"
                                      style={{ color: cutColor }}
                                    >
                                      -
                                      {formatCurrency(les.amount * platformCut)}
                                    </span>
                                    <span className="ml-2 text-[11px] font-semibold text-foreground">
                                      {formatCurrency(
                                        les.amount * (1 - platformCut),
                                      )}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {sub.standaloneLessons.length > 0 && (
                      <div>
                        {sub.standaloneLessons.map((les) => {
                          const lessonInfo = mockLessons.find(
                            (l) => l.id === les.lessonId,
                          );
                          return (
                            <div
                              key={les.lessonId}
                              className="flex items-center gap-3 pl-10 pr-5 py-2.5 border-t border-border/20"
                            >
                              <PlayCircle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              <span className="flex-1 text-xs text-foreground/80">
                                {lessonInfo?.title ?? les.lessonId}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                {les.sales} ventes
                              </span>
                              <span
                                className="ml-2 text-[11px] font-medium"
                                style={{ color: cutColor }}
                              >
                                -{formatCurrency(les.amount * platformCut)}
                              </span>
                              <span className="ml-2 text-xs font-semibold text-foreground">
                                {formatCurrency(les.amount * (1 - platformCut))}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown by resource */}
      <div className="dash-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4" style={{ color: totalColor }} />
            Détail par ressource
          </h2>
          <div
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
            style={{
              background: "oklch(0.96 0.025 20)",
              color: cutColor,
            }}
          >
            <ShoppingCart className="h-3 w-3" />
            Commission {(platformCut * 100).toFixed(0)}% déduite
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-9 w-9 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-foreground">
            Aucune vente de ressource
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Les revenus issus des ressources apparaîtront ici.
          </p>
        </div>
      </div>

      {/* Recurring sessions */}
      {revenue.recurringSessions && revenue.recurringSessions.length > 0 && (
        <div className="dash-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Repeat2 className="h-4 w-4" style={{ color: totalColor }} />
              Séances récurrentes ce mois
            </h2>
            <div
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
              style={{
                background: "oklch(0.96 0.025 20)",
                color: cutColor,
              }}
            >
              <ShoppingCart className="h-3 w-3" />
              Commission {(platformCut * 100).toFixed(0)}% déduite
            </div>
          </div>

          <div className="divide-y divide-border/40">
            {revenue.recurringSessions.map((sess) => {
              const sessColor = getSubjectColor(sess.subjectId);
              const sessNet = sess.amount * (1 - platformCut);
              const totalPerSession = sess.pricePerStudent * sess.studentCount;
              return (
                <div
                  key={sess.sessionId}
                  className="flex items-center gap-3 px-5 py-3.5"
                >
                  {/* type + mode badge */}
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: `color-mix(in oklch, ${sessColor} 12%, transparent)`,
                    }}
                  >
                    {sess.mode === "online" ? (
                      <Monitor
                        className="h-3.5 w-3.5"
                        style={{ color: sessColor }}
                      />
                    ) : (
                      <MapPin
                        className="h-3.5 w-3.5"
                        style={{ color: sessColor }}
                      />
                    )}
                  </div>

                  {/* title + meta */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {sess.title}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 flex-wrap">
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-medium rounded-full px-1.5 py-0.5"
                        style={{
                          background: `color-mix(in oklch, ${sessColor} 10%, transparent)`,
                          color: sessColor,
                        }}
                      >
                        {sess.type === "group" ? (
                          <Users className="h-2.5 w-2.5" />
                        ) : (
                          <GraduationCap className="h-2.5 w-2.5" />
                        )}
                        {sess.type === "group" ? "Groupe" : "Particulier"}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Users className="h-2.5 w-2.5" />
                        {sess.studentCount} élève
                        {sess.studentCount > 1 ? "s" : ""}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Repeat2 className="h-2.5 w-2.5" />
                        {sess.sessionsThisMonth}× ce mois
                      </span>
                    </div>
                  </div>

                  {/* pricing breakdown */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] text-muted-foreground">
                        Prix / élève
                      </p>
                      <p className="text-xs font-semibold text-foreground">
                        {formatCurrency(sess.pricePerStudent)}
                      </p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] text-muted-foreground">
                        / séance
                      </p>
                      <p className="text-xs font-semibold text-foreground">
                        {formatCurrency(totalPerSession)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px]" style={{ color: cutColor }}>
                        -{formatCurrency(sess.amount * platformCut)}
                      </p>
                      <p
                        className="text-sm font-bold"
                        style={{ color: sessColor }}
                      >
                        {formatCurrency(sessNet)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recurring total row */}
          <div
            className="flex items-center justify-between px-5 py-3 border-t border-border/60"
            style={{ background: "oklch(0.98 0.005 250)" }}
          >
            <span className="text-xs font-semibold text-muted-foreground">
              Total séances récurrentes
            </span>
            <div className="flex items-center gap-3">
              <span
                className="text-[11px] font-medium"
                style={{ color: cutColor }}
              >
                -
                {formatCurrency(
                  revenue.recurringSessions.reduce(
                    (a, s) => a + s.amount * platformCut,
                    0,
                  ),
                )}
              </span>
              <span className="text-sm font-bold" style={{ color: netColor }}>
                {formatCurrency(
                  revenue.recurringSessions.reduce(
                    (a, s) => a + s.amount * (1 - platformCut),
                    0,
                  ),
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Resources Section ────────────────────────────────────────────────────────

const resourceTypeIcon: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  document: FileText,
  video: Video,
  audio: Mic,
  image: FileText,
  other: FileText,
};

const resourceTypeLabel: Record<string, string> = {
  document: "Document",
  video: "Vidéo",
  audio: "Audio",
  image: "Image",
  other: "Autre",
};

const resourceStatusStyle: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  published: {
    bg: "oklch(0.95 0.018 155)",
    color: "oklch(0.38 0.12 155)",
    label: "Publié",
  },
  draft: {
    bg: "oklch(0.94 0.008 80)",
    color: "oklch(0.48 0.02 250)",
    label: "Brouillon",
  },
  archived: {
    bg: "oklch(0.96 0.03 80)",
    color: "oklch(0.52 0.14 80)",
    label: "Archivé",
  },
};

function TutorResourcesSection({
  resources,
  color,
}: {
  resources: TutorResource[];
  color: string;
}) {
  const [filter, setFilter] = useState<
    "all" | "published" | "draft" | "archived"
  >("all");

  const filtered =
    filter === "all" ? resources : resources.filter((r) => r.status === filter);

  const counts = {
    all: resources.length,
    published: resources.filter((r) => r.status === "published").length,
    draft: resources.filter((r) => r.status === "draft").length,
    archived: resources.filter((r) => r.status === "archived").length,
  };

  return (
    <div className="dash-card overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border/60">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-4 w-4" style={{ color }} />
          Ressources
        </h2>
        <div className="flex gap-1">
          {(["all", "published", "draft", "archived"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="rounded-full px-2.5 py-1 text-[11px] font-medium border transition-colors"
              style={
                filter === s
                  ? {
                      background: `${color}18`,
                      borderColor: `${color}40`,
                      color,
                    }
                  : {}
              }
            >
              {s === "all" ? "Tous" : resourceStatusStyle[s].label}{" "}
              <span className="opacity-60">{counts[s]}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-9 w-9 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-foreground">
            Aucune ressource
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Les ressources ajoutées apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/40">
          {filtered.map((res) => {
            const Icon = resourceTypeIcon[res.type] ?? FileText;
            const status = resourceStatusStyle[res.status];
            const linkedLesson = res.lessonId
              ? mockLessons.find((l) => l.id === res.lessonId)
              : null;
            const subColor = res.subjectId
              ? getSubjectColor(res.subjectId)
              : "oklch(0.58 0.16 250)";
            return (
              <div key={res.id} className="flex items-start gap-4 px-5 py-3">
                <div
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${subColor}15` }}
                >
                  <Icon className="h-4 w-4" style={{ color: subColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground">
                      {res.title}
                    </p>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{ background: status.bg, color: status.color }}
                    >
                      {status.label}
                    </span>
                  </div>
                  {res.description && (
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                      {res.description}
                    </p>
                  )}
                  <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
                    <span>{resourceTypeLabel[res.type]}</span>
                    <span>{res.fileSize}</span>
                    {res.subjectId && (
                      <span style={{ color: subColor }}>
                        {getSubjectName(res.subjectId)}
                      </span>
                    )}
                    {linkedLesson && (
                      <span className="flex items-center gap-1">
                        <PlayCircle className="h-3 w-3" />
                        {linkedLesson.title}
                      </span>
                    )}
                    <span>{res.uploadedDate}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {res.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {res.downloads}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TutorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [tutors, setTutors] = useState<Tutor[]>(mockTutors);
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "deactivate" | "reject" | null
  >(null);

  const tutor = tutors.find((t) => t.id === id);
  if (!tutor) notFound();

  const primarySubjectId = tutor.subjectIds[0];
  const color = getSubjectColor(primarySubjectId);
  const initials = tutor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleApprove = () => {
    setTutors((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "active" } : t)),
    );
    setConfirmAction(null);
  };

  const handleDeactivate = () => {
    setTutors((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "inactive" } : t)),
    );
    setConfirmAction(null);
  };

  const handleReject = () => {
    setTutors((prev) => prev.filter((t) => t.id !== id));
    setConfirmAction(null);
    window.location.href = "/dashboard/tutors";
  };

  // Current tutor after state change
  const currentTutor = tutors.find((t) => t.id === id) ?? tutor;
  const platformCut = useSettingsStore((s) => s.platformCut);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Compact header */}
      <header
        className="shrink-0 border-b border-border/60 bg-background"
        style={{
          background: `linear-gradient(135deg, ${color}0a 0%, transparent 60%)`,
        }}
      >
        {/* Breadcrumb row */}
        <div className="flex h-11 items-center justify-between border-b border-border/40 px-6">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/tutors">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 rounded-lg px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Tuteurs
              </Button>
            </Link>
            <span className="text-border/80 text-xs">/</span>
            <span className="text-xs font-medium text-foreground">
              {currentTutor.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {currentTutor.status === "pending" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1.5 rounded-lg px-3 text-xs text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setConfirmAction("reject")}
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Rejeter
                </Button>
                <Button
                  size="sm"
                  className="h-7 gap-1.5 rounded-lg px-3 text-xs text-white"
                  style={{ background: "oklch(0.58 0.16 155)" }}
                  onClick={() => setConfirmAction("approve")}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Approuver
                </Button>
              </>
            )}
            {currentTutor.status === "active" && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1.5 rounded-lg px-3 text-xs"
                onClick={() => setConfirmAction("deactivate")}
              >
                <XCircle className="h-3.5 w-3.5" />
                Désactiver
              </Button>
            )}
            {currentTutor.status === "inactive" && (
              <Button
                size="sm"
                className="h-7 gap-1.5 rounded-lg px-3 text-xs text-white"
                style={{ background: "oklch(0.58 0.16 155)" }}
                onClick={() => setConfirmAction("approve")}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Réactiver
              </Button>
            )}
          </div>
        </div>

        {/* Profile + stats row */}
        <div className="flex items-center gap-5 px-6 py-4">
          {/* Avatar */}
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white shadow-sm"
            style={{ background: color }}
          >
            {initials}
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-base font-bold text-foreground leading-none">
                {currentTutor.name}
              </h1>
              <StatusBadge status={currentTutor.status} />
              {currentTutor.subjectIds.map((sid) => (
                <span
                  key={sid}
                  className="flex items-center gap-1 text-xs font-medium"
                  style={{ color: getSubjectColor(sid) }}
                >
                  <BookOpen className="h-3 w-3" />
                  {getSubjectName(sid)}
                </span>
              ))}
            </div>
            <div className="mt-1.5 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {currentTutor.location}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Award className="h-3 w-3" />
                {currentTutor.experience}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Mail className="h-3 w-3" />
                {currentTutor.email}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                {currentTutor.phone}
              </span>
              {currentTutor.languages.length > 0 && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Languages className="h-3 w-3" />
                  {currentTutor.languages.join(", ")}
                </span>
              )}
            </div>
          </div>

          {/* Stat pills */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {currentTutor.rating > 0 && (
              <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/60 px-3 py-2">
                <Star
                  className="h-3.5 w-3.5"
                  style={{
                    color: "oklch(0.72 0.14 80)",
                    fill: "oklch(0.72 0.14 80)",
                  }}
                />
                <span className="text-sm font-bold text-foreground">
                  {currentTutor.rating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">/5</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/60 px-3 py-2">
              <Users
                className="h-3.5 w-3.5"
                style={{ color: "oklch(0.52 0.14 250)" }}
              />
              <span className="text-sm font-bold text-foreground">
                {currentTutor.students || "—"}
              </span>
              <span className="text-xs text-muted-foreground">étudiants</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/60 px-3 py-2">
              <CalendarDays className="h-3.5 w-3.5" style={{ color }} />
              <span className="text-sm font-bold text-foreground">
                {currentTutor.classesThisMonth || "—"}
              </span>
              <span className="text-xs text-muted-foreground">cours/mois</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/60 px-3 py-2">
              <TrendingUp
                className="h-3.5 w-3.5"
                style={{ color: "oklch(0.58 0.16 155)" }}
              />
              <span className="text-sm font-bold text-foreground">
                {currentTutor.completionRate
                  ? `${currentTutor.completionRate}%`
                  : "—"}
              </span>
              <span className="text-xs text-muted-foreground">achèvement</span>
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList
              variant="line"
              className="w-full justify-start border-b border-border/60 rounded-none pb-0 h-auto"
            >
              <TabsTrigger value="overview" className="gap-1.5 pb-3">
                <Users className="h-3.5 w-3.5" />
                Vue générale
              </TabsTrigger>
              <TabsTrigger value="content" className="gap-1.5 pb-3">
                <PlayCircle className="h-3.5 w-3.5" />
                Contenu
              </TabsTrigger>
              <TabsTrigger value="revenue" className="gap-1.5 pb-3">
                <TrendingUp className="h-3.5 w-3.5" />
                Revenus
              </TabsTrigger>
              <TabsTrigger value="resources" className="gap-1.5 pb-3">
                <FileText className="h-3.5 w-3.5" />
                Ressources
              </TabsTrigger>
              <TabsTrigger value="schedule" className="gap-1.5 pb-3">
                <CalendarRange className="h-3.5 w-3.5" />
                Planning
              </TabsTrigger>
            </TabsList>

            {/* Overview tab */}
            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                {/* Row 1 — bio + quick stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Bio */}
                  <div className="lg:col-span-2 dash-card p-5">
                    <h2 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" style={{ color }} />À
                      propos
                    </h2>
                    <p className="text-sm text-foreground/75 leading-relaxed">
                      {currentTutor.bio || "Aucune biographie renseignée."}
                    </p>
                  </div>

                  {/* Quick stats */}
                  <div className="dash-card p-5 flex flex-col justify-between gap-4">
                    {[
                      {
                        label: "Cours ce mois",
                        value: currentTutor.classesThisMonth || "—",
                        icon: (
                          <CalendarDays
                            className="h-3.5 w-3.5"
                            style={{ color }}
                          />
                        ),
                      },
                      {
                        label: "Total cours",
                        value: currentTutor.totalClasses || "—",
                        icon: (
                          <BookOpen className="h-3.5 w-3.5" style={{ color }} />
                        ),
                      },
                      {
                        label: "Taux d'achèvement",
                        value: currentTutor.completionRate
                          ? `${currentTutor.completionRate}%`
                          : "—",
                        icon: (
                          <TrendingUp
                            className="h-3.5 w-3.5"
                            style={{ color: "oklch(0.58 0.16 155)" }}
                          />
                        ),
                      },
                      {
                        label: "Temps de réponse",
                        value: currentTutor.responseTime || "—",
                        icon: (
                          <Clock
                            className="h-3.5 w-3.5"
                            style={{ color: "oklch(0.52 0.14 250)" }}
                          />
                        ),
                      },
                    ].map(({ label, value, icon }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {icon}
                          <span className="text-xs text-muted-foreground">
                            {label}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Row 2 — qualifications + pricing + upcoming */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Qualifications */}
                  <div className="dash-card p-5">
                    <h2 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" style={{ color }} />
                      Diplômes & qualifications
                    </h2>
                    {currentTutor.qualifications.length > 0 ? (
                      <ul className="space-y-3">
                        {currentTutor.qualifications.map((q, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div
                              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                              style={{ background: color }}
                            >
                              {i + 1}
                            </div>
                            <span className="text-sm text-foreground/80 leading-snug">
                              {q}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Aucune qualification renseignée.
                      </p>
                    )}
                  </div>

                  {/* Session pricing */}
                  {currentTutor.sessionPricing ? (
                    <div className="dash-card overflow-hidden">
                      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/60">
                        <Tag className="h-3.5 w-3.5" style={{ color }} />
                        <h2 className="text-sm font-semibold text-foreground">
                          Tarifs des séances
                        </h2>
                      </div>
                      <div className="p-4 space-y-3">
                        {/* Individual */}
                        {currentTutor.sessionPricing.individual && (
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                              Cours particulier
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {(["online", "presential"] as const).map(
                                (mode) => {
                                  const tier =
                                    currentTutor.sessionPricing!.individual![
                                      mode
                                    ];
                                  if (!tier) return null;
                                  const isOnline = mode === "online";
                                  return (
                                    <div
                                      key={mode}
                                      className="rounded-lg p-2.5"
                                      style={{
                                        background: tier.accepted
                                          ? `color-mix(in oklch, ${color} 8%, transparent)`
                                          : "oklch(0.97 0 0)",
                                        border: `1px solid ${tier.accepted ? `color-mix(in oklch, ${color} 20%, transparent)` : "oklch(0.92 0 0)"}`,
                                      }}
                                    >
                                      <div className="flex items-center gap-1.5 mb-1.5">
                                        {isOnline ? (
                                          <Monitor
                                            className="h-3 w-3"
                                            style={{
                                              color: tier.accepted
                                                ? color
                                                : "oklch(0.70 0 0)",
                                            }}
                                          />
                                        ) : (
                                          <MapPin
                                            className="h-3 w-3"
                                            style={{
                                              color: tier.accepted
                                                ? color
                                                : "oklch(0.70 0 0)",
                                            }}
                                          />
                                        )}
                                        <span
                                          className="text-[10px] font-medium"
                                          style={{
                                            color: tier.accepted
                                              ? color
                                              : "oklch(0.60 0 0)",
                                          }}
                                        >
                                          {isOnline ? "En ligne" : "Présentiel"}
                                        </span>
                                      </div>
                                      {tier.accepted ? (
                                        <p className="text-sm font-bold text-foreground">
                                          {formatCurrency(tier.pricePerStudent)}
                                          <span className="text-[10px] font-normal text-muted-foreground">
                                            /séance
                                          </span>
                                        </p>
                                      ) : (
                                        <p className="text-xs font-medium text-muted-foreground/60 line-through">
                                          Non disponible
                                        </p>
                                      )}
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          </div>
                        )}
                        {/* Group */}
                        {currentTutor.sessionPricing.group && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Séance de groupe
                              </p>
                              {currentTutor.sessionPricing.group.maxStudents &&
                                (currentTutor.sessionPricing.group.online
                                  ?.accepted ||
                                  currentTutor.sessionPricing.group.presential
                                    ?.accepted) && (
                                  <span
                                    className="flex items-center gap-1 text-[10px] font-medium rounded-full px-1.5 py-0.5"
                                    style={{
                                      background: `color-mix(in oklch, ${color} 10%, transparent)`,
                                      color,
                                    }}
                                  >
                                    <Users className="h-2.5 w-2.5" />
                                    max{" "}
                                    {
                                      currentTutor.sessionPricing.group
                                        .maxStudents
                                    }
                                  </span>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {(["online", "presential"] as const).map(
                                (mode) => {
                                  const tier =
                                    currentTutor.sessionPricing!.group![mode];
                                  if (!tier) return null;
                                  const isOnline = mode === "online";
                                  return (
                                    <div
                                      key={mode}
                                      className="rounded-lg p-2.5"
                                      style={{
                                        background: tier.accepted
                                          ? `color-mix(in oklch, ${color} 8%, transparent)`
                                          : "oklch(0.97 0 0)",
                                        border: `1px solid ${tier.accepted ? `color-mix(in oklch, ${color} 20%, transparent)` : "oklch(0.92 0 0)"}`,
                                      }}
                                    >
                                      <div className="flex items-center gap-1.5 mb-1.5">
                                        {isOnline ? (
                                          <Monitor
                                            className="h-3 w-3"
                                            style={{
                                              color: tier.accepted
                                                ? color
                                                : "oklch(0.70 0 0)",
                                            }}
                                          />
                                        ) : (
                                          <MapPin
                                            className="h-3 w-3"
                                            style={{
                                              color: tier.accepted
                                                ? color
                                                : "oklch(0.70 0 0)",
                                            }}
                                          />
                                        )}
                                        <span
                                          className="text-[10px] font-medium"
                                          style={{
                                            color: tier.accepted
                                              ? color
                                              : "oklch(0.60 0 0)",
                                          }}
                                        >
                                          {isOnline ? "En ligne" : "Présentiel"}
                                        </span>
                                      </div>
                                      {tier.accepted ? (
                                        <p className="text-sm font-bold text-foreground">
                                          {formatCurrency(tier.pricePerStudent)}
                                          <span className="text-[10px] font-normal text-muted-foreground">
                                            /élève
                                          </span>
                                        </p>
                                      ) : (
                                        <p className="text-xs font-medium text-muted-foreground/60 line-through">
                                          Non disponible
                                        </p>
                                      )}
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          </div>
                        )}
                        {currentTutor.sessionPricing.notes && (
                          <p className="text-[11px] text-muted-foreground italic border-t border-border/40 pt-3">
                            {currentTutor.sessionPricing.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="dash-card p-5 flex flex-col items-center justify-center text-center gap-2">
                      <Tag className="h-7 w-7 text-muted-foreground/30" />
                      <p className="text-xs text-muted-foreground">
                        Aucun tarif renseigné
                      </p>
                    </div>
                  )}

                  {/* Upcoming classes */}
                  <div className="dash-card p-5">
                    <h2 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      Cours à venir
                    </h2>
                    {currentTutor.upcomingClasses.length > 0 ? (
                      <div className="space-y-2.5">
                        {currentTutor.upcomingClasses.map((cls) => {
                          const clsColor = getSubjectColor(cls.subjectId);
                          return (
                            <div
                              key={cls.subjectId + cls.date}
                              className="rounded-xl p-3"
                              style={{
                                background: `${clsColor}08`,
                                border: `1px solid ${clsColor}20`,
                              }}
                            >
                              <p className="text-xs font-semibold text-foreground">
                                {getSubjectName(cls.subjectId)}
                              </p>
                              <p
                                className="mt-0.5 text-[11px] font-medium"
                                style={{ color: clsColor }}
                              >
                                {cls.date} · {cls.time}
                              </p>
                              <div className="mt-1.5 flex items-center gap-1">
                                <Users className="h-3 w-3 text-muted-foreground" />
                                <span className="text-[11px] text-muted-foreground">
                                  {cls.students} étudiants
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <CalendarDays className="h-8 w-8 text-muted-foreground/30 mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Aucun cours à venir
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 3 — recent students + earnings + account */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent students */}
                  <div className="lg:col-span-1 dash-card p-5">
                    <h2 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      Étudiants récents
                    </h2>
                    {currentTutor.recentStudents.length > 0 ? (
                      <div className="space-y-3">
                        {currentTutor.recentStudents.map((s) => {
                          const scoreColor =
                            s.progress >= 90
                              ? "oklch(0.58 0.16 155)"
                              : s.progress >= 75
                                ? "oklch(0.62 0.16 80)"
                                : "oklch(0.68 0.18 20)";
                          const studentInitials = s.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();
                          return (
                            <div
                              key={s.name}
                              className="flex items-center gap-4"
                            >
                              <div
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                style={{ background: "oklch(0.62 0.16 80)" }}
                              >
                                {studentInitials}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {s.name}
                                  </p>
                                  <span className="ml-2 shrink-0 text-[11px] text-muted-foreground">
                                    {s.grade}
                                  </span>
                                </div>
                                <ScoreBar
                                  value={s.progress}
                                  color={scoreColor}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Users className="h-8 w-8 text-muted-foreground/30 mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Aucun étudiant assigné pour l&apos;instant
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Monthly earnings */}
                  <div className="dash-card p-5">
                    <h2 className="mb-1 text-sm font-semibold text-foreground">
                      Revenus mensuels
                    </h2>
                    <p className="text-2xl font-bold text-foreground">
                      {currentTutor.monthlyEarnings > 0
                        ? formatCurrency(currentTutor.monthlyEarnings)
                        : "—"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Estimation du mois en cours
                    </p>
                    {currentTutor.monthlyEarnings > 0 && (
                      <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>vs. moy. plateforme</span>
                          <span
                            className="font-semibold"
                            style={{ color: "oklch(0.58 0.16 155)" }}
                          >
                            +12%
                          </span>
                        </div>
                        <ScoreBar
                          value={Math.min(
                            (currentTutor.monthlyEarnings / 5000) * 100,
                            100,
                          )}
                          color="oklch(0.58 0.16 155)"
                        />
                      </div>
                    )}
                  </div>

                  {/* Account info */}
                  <div className="dash-card p-5 space-y-3">
                    <h2 className="text-sm font-semibold text-foreground">
                      Informations du compte
                    </h2>
                    {[
                      {
                        label: "Membre depuis",
                        value: currentTutor.joinedDate,
                      },
                      {
                        label: "ID tuteur",
                        value: currentTutor.id.toUpperCase(),
                      },
                      {
                        label: "Disponibilité",
                        value: currentTutor.availability,
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex items-start justify-between gap-4"
                      >
                        <span className="text-xs text-muted-foreground">
                          {label}
                        </span>
                        <span className="text-xs font-medium text-foreground text-right">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Content tab */}
            <TabsContent value="content" className="mt-6">
              <TutorLessonsSection
                tutorId={currentTutor.id}
                subjectIds={currentTutor.subjectIds}
                color={color}
              />
            </TabsContent>

            {/* Revenue tab */}
            <TabsContent value="revenue" className="mt-6">
              {currentTutor.revenue ? (
                <TutorRevenueSection
                  revenue={currentTutor.revenue}
                  platformCut={platformCut}
                />
              ) : (
                <div className="dash-card flex flex-col items-center justify-center py-16 text-center">
                  <TrendingUp className="h-10 w-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm font-medium text-foreground">
                    Aucune donnée de revenus
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Les revenus apparaîtront ici une fois que le tuteur aura des
                    ventes.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Resources tab */}
            <TabsContent value="resources" className="mt-6">
              {currentTutor.resources && currentTutor.resources.length > 0 ? (
                <TutorResourcesSection
                  resources={currentTutor.resources}
                  color={color}
                />
              ) : (
                <div className="dash-card flex flex-col items-center justify-center py-16 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm font-medium text-foreground">
                    Aucune ressource
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Les ressources ajoutées par ce tuteur apparaîtront ici.
                  </p>
                </div>
              )}
            </TabsContent>
            {/* Schedule tab */}
            <TabsContent value="schedule" className="mt-6">
              <ScheduleView
                schedule={
                  currentTutor.schedule ?? mockSchedules[currentTutor.id]
                }
                getSubjectColor={getSubjectColor}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Approve confirmation */}
      <Modal
        open={confirmAction === "approve"}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        type="confirmation"
        title={
          currentTutor.status === "inactive"
            ? "Réactiver le tuteur"
            : "Approuver le tuteur"
        }
        description={`Êtes-vous sûr de vouloir ${currentTutor.status === "inactive" ? "réactiver" : "approuver"} ${currentTutor.name} ? Il/elle obtiendra un accès complet à la plateforme et pourra commencer à enseigner immédiatement.`}
        size="sm"
        actions={{
          primary: {
            label:
              currentTutor.status === "inactive"
                ? "Oui, réactiver"
                : "Oui, approuver",
            onClick: handleApprove,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setConfirmAction(null),
            variant: "outline",
          },
        }}
      >
        <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: color }}
          >
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium">{currentTutor.name}</p>
            <p className="text-xs text-muted-foreground">
              {currentTutor.subjectIds.map(getSubjectName).join(", ")} ·{" "}
              {currentTutor.experience}
            </p>
          </div>
        </div>
      </Modal>

      {/* Deactivate confirmation */}
      <Modal
        open={confirmAction === "deactivate"}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        type="warning"
        title="Désactiver le tuteur"
        description={`${currentTutor.name} perdra l&apos;accès à la plateforme et ses cours seront mis en pause. Vous pouvez le/la réactiver à tout moment.`}
        size="sm"
        actions={{
          primary: {
            label: "Désactiver",
            onClick: handleDeactivate,
            variant: "destructive",
          },
          secondary: {
            label: "Annuler",
            onClick: () => setConfirmAction(null),
            variant: "outline",
          },
        }}
      >
        {currentTutor.students > 0 && (
          <div
            className="flex items-start gap-2 rounded-xl border px-3 py-2.5 text-xs"
            style={{
              background: "oklch(0.96 0.025 20)",
              borderColor: "oklch(0.88 0.08 20)",
              color: "oklch(0.42 0.12 20)",
            }}
          >
            <Users className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              Ce tuteur a{" "}
              <strong>{currentTutor.students} étudiants actifs</strong> qui
              seront affectés.
            </span>
          </div>
        )}
      </Modal>

      {/* Reject confirmation */}
      <Modal
        open={confirmAction === "reject"}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        type="warning"
        title="Rejeter la candidature"
        description={`La candidature de ${currentTutor.name} sera définitivement supprimée. Cette action est irréversible.`}
        size="sm"
        actions={{
          primary: {
            label: "Rejeter et supprimer",
            onClick: handleReject,
            variant: "destructive",
          },
          secondary: {
            label: "Annuler",
            onClick: () => setConfirmAction(null),
            variant: "outline",
          },
        }}
      >
        <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: color }}
          >
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium">{currentTutor.name}</p>
            <p className="text-xs text-muted-foreground">
              {currentTutor.subjectIds.map(getSubjectName).join(", ")} · Applied{" "}
              {currentTutor.joinedDate}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
