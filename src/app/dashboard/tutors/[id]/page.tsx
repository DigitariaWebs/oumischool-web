"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  getSubjectColor,
  getSubjectName,
  mockLessons,
  mockLessonSeries,
  mockSubjects,
  mockTutors,
} from "@/lib/data/tutors";
import { formatCurrency } from "@/lib/utils";
import { Tutor, TutorResource, TutorRevenue } from "@/types";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CalendarDays,
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
  Phone,
  PlayCircle,
  ShoppingCart,
  Star,
  TrendingUp,
  Users,
  Video,
  XCircle,
  Zap,
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

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  bg,
}: {
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="dash-card p-5 flex flex-col gap-3">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ background: bg }}
      >
        <Icon className="h-4.5 w-4.5" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs font-medium text-muted-foreground mt-0.5">
          {label}
        </p>
        {sub && (
          <p className="text-[11px] text-muted-foreground/60 mt-0.5">{sub}</p>
        )}
      </div>
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

function TutorRevenueSection({ revenue }: { revenue: TutorRevenue }) {
  const [openSubject, setOpenSubject] = useState<string | null>(
    revenue.bySubject[0]?.subjectId ?? null,
  );
  const [openSeries, setOpenSeries] = useState<string | null>(null);

  const totalColor = "oklch(0.52 0.14 250)";

  return (
    <div className="dash-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4" style={{ color: totalColor }} />
          Revenus détaillés
        </h2>
        <span className="text-sm font-bold" style={{ color: totalColor }}>
          {formatCurrency(revenue.total)}
        </span>
      </div>

      <div className="divide-y divide-border/40">
        {revenue.bySubject.map((sub) => {
          const subColor = getSubjectColor(sub.subjectId);
          const isSubOpen = openSubject === sub.subjectId;
          return (
            <div key={sub.subjectId}>
              {/* Subject row */}
              <button
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors text-left"
                onClick={() => setOpenSubject(isSubOpen ? null : sub.subjectId)}
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
                    sub.standaloneLessons.reduce((a, l) => a + l.sales, 0)}{" "}
                  ventes
                </span>
                <span
                  className="ml-3 text-sm font-bold"
                  style={{ color: subColor }}
                >
                  {formatCurrency(sub.amount)}
                </span>
              </button>

              {isSubOpen && (
                <div className="border-t border-border/40">
                  {/* Series */}
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
                            className="ml-3 text-xs font-bold"
                            style={{ color: subColor }}
                          >
                            {formatCurrency(ser.amount)}
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
                                  <span className="ml-3 text-[11px] font-semibold text-foreground">
                                    {formatCurrency(les.amount)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Standalone lessons */}
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
                            <span className="ml-3 text-xs font-semibold text-foreground">
                              {formatCurrency(les.amount)}
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

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background px-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/tutors">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 rounded-xl text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Tuteurs
            </Button>
          </Link>
          <span className="text-border/80">/</span>
          <span className="text-sm font-medium text-foreground">
            {currentTutor.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentTutor.status === "pending" && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setConfirmAction("reject")}
              >
                <XCircle className="h-3.5 w-3.5" />
                Rejeter
              </Button>
              <Button
                size="sm"
                className="gap-1.5 rounded-xl text-white"
                style={{ background: "oklch(0.58 0.16 155)" }}
                onClick={() => setConfirmAction("approve")}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approuver le tuteur
              </Button>
            </>
          )}
          {currentTutor.status === "active" && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 rounded-xl"
              onClick={() => setConfirmAction("deactivate")}
            >
              <XCircle className="h-3.5 w-3.5" />
              Désactiver
            </Button>
          )}
          {currentTutor.status === "inactive" && (
            <Button
              size="sm"
              className="gap-1.5 rounded-xl text-white"
              style={{ background: "oklch(0.58 0.16 155)" }}
              onClick={() => setConfirmAction("approve")}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Réactiver
            </Button>
          )}
        </div>
      </header>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl p-6 space-y-6">
          {/* Profile hero */}
          <div className="dash-card overflow-hidden">
            {/* Colored banner */}
            <div
              className="h-24 w-full"
              style={{
                background: `linear-gradient(135deg, ${color}28 0%, ${color}10 100%)`,
                borderBottom: `1px solid ${color}20`,
              }}
            />
            <div className="px-6 pb-6">
              {/* Avatar — overlapping the banner */}
              <div className="-mt-10 mb-4 flex items-end justify-between">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-md ring-4 ring-card"
                  style={{ background: color }}
                >
                  {initials}
                </div>
                <StatusBadge status={currentTutor.status} />
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground">
                  {currentTutor.name}
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  {currentTutor.subjectIds.map((sid) => (
                    <div key={sid} className="flex items-center gap-1.5">
                      <BookOpen
                        className="h-3.5 w-3.5"
                        style={{ color: getSubjectColor(sid) }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: getSubjectColor(sid) }}
                      >
                        {getSubjectName(sid)}
                      </span>
                    </div>
                  ))}
                  <span className="text-muted-foreground/40">·</span>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {currentTutor.location}
                  </div>
                  <span className="text-muted-foreground/40">·</span>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Award className="h-3.5 w-3.5" />
                    {currentTutor.experience} d&apos;expérience
                  </div>
                </div>
                {currentTutor.rating > 0 && (
                  <div className="flex items-center gap-1 pt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4"
                        style={{
                          color:
                            i < Math.round(currentTutor.rating)
                              ? "oklch(0.72 0.14 80)"
                              : "oklch(0.88 0.01 80)",
                          fill:
                            i < Math.round(currentTutor.rating)
                              ? "oklch(0.72 0.14 80)"
                              : "oklch(0.88 0.01 80)",
                        }}
                      />
                    ))}
                    <span
                      className="ml-1 text-sm font-semibold"
                      style={{ color: "oklch(0.62 0.14 80)" }}
                    >
                      {currentTutor.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">/ 5.0</span>
                  </div>
                )}
              </div>

              <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {currentTutor.bio || "Aucune biographie renseignée."}
              </p>

              {/* Contact pills */}
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  { icon: Mail, label: currentTutor.email },
                  { icon: Phone, label: currentTutor.phone },
                  {
                    icon: Clock,
                    label: currentTutor.availability,
                  },
                  {
                    icon: Zap,
                    label:
                      currentTutor.responseTime !== "N/A"
                        ? `Répond ${currentTutor.responseTime}`
                        : "Temps de réponse N/D",
                  },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-xs text-foreground/70"
                  >
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    {label}
                  </div>
                ))}
                {currentTutor.languages.length > 0 && (
                  <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-xs text-foreground/70">
                    <Languages className="h-3.5 w-3.5 text-muted-foreground" />
                    {currentTutor.languages.join(", ")}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              label="Étudiants actifs"
              value={currentTutor.students || "—"}
              sub={
                currentTutor.students
                  ? "inscrits actuellement"
                  : "aucun pour l&apos;instant"
              }
              color="oklch(0.52 0.14 250)"
              bg="oklch(0.93 0.02 250)"
            />
            <StatCard
              icon={CalendarDays}
              label="Cours ce mois-ci"
              value={currentTutor.classesThisMonth || "—"}
              sub={
                currentTutor.totalClasses
                  ? `${currentTutor.totalClasses} au total`
                  : "aucun cours pour l&apos;instant"
              }
              color={color}
              bg={`${color}18`}
            />
            <StatCard
              icon={TrendingUp}
              label="Taux d'achèvement"
              value={
                currentTutor.completionRate
                  ? `${currentTutor.completionRate}%`
                  : "—"
              }
              sub="des cours planifiés"
              color="oklch(0.58 0.16 155)"
              bg="oklch(0.95 0.018 155)"
            />
            <StatCard
              icon={Star}
              label="Note moyenne"
              value={currentTutor.rating ? currentTutor.rating.toFixed(1) : "—"}
              sub="sur 5.0"
              color="oklch(0.62 0.14 80)"
              bg="oklch(0.95 0.03 80)"
            />
          </div>

          {/* Lessons tab */}
          <TutorLessonsSection
            tutorId={currentTutor.id}
            subjectIds={currentTutor.subjectIds}
            color={color}
          />

          {/* Revenue */}
          {currentTutor.revenue && (
            <TutorRevenueSection revenue={currentTutor.revenue} />
          )}

          {/* Resources */}
          {currentTutor.resources && currentTutor.resources.length > 0 && (
            <TutorResourcesSection
              resources={currentTutor.resources}
              color={color}
            />
          )}

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left col — 2/3 */}
            <div className="lg:col-span-2 space-y-6">
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

              {/* Recent students */}
              <div className="dash-card p-5">
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
                      const initials = s.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();
                      return (
                        <div key={s.name} className="flex items-center gap-4">
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                            style={{ background: "oklch(0.62 0.16 80)" }}
                          >
                            {initials}
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
                            <ScoreBar value={s.progress} color={scoreColor} />
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
            </div>

            {/* Right col — 1/3 */}
            <div className="space-y-6">
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

              {/* Joined info */}
              <div className="dash-card p-5 space-y-3">
                <h2 className="text-sm font-semibold text-foreground">
                  Informations du compte
                </h2>
                {[
                  { label: "Membre depuis", value: currentTutor.joinedDate },
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
