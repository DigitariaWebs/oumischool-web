"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  useDeactivateStudent,
  useReactivateStudent,
  useStudentDetail,
} from "@/hooks/students";
import type { AdminStudent } from "@/hooks/students/api";
import { Student } from "@/types";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Mail,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STUDENT_COLOR = "oklch(0.62 0.16 80)";
const SUBJECT_COLORS: Record<string, string> = {
  math: "oklch(0.72 0.14 80)",
  mathematics: "oklch(0.72 0.14 80)",
  physics: "oklch(0.65 0.12 220)",
  "ui/ux": "oklch(0.58 0.16 155)",
  design: "oklch(0.68 0.18 20)",
};

function scoreColor(value: number): string {
  if (value >= 90) return "oklch(0.58 0.16 155)";
  if (value >= 75) return "oklch(0.62 0.16 80)";
  if (value >= 60) return "oklch(0.65 0.12 220)";
  return "oklch(0.68 0.18 20)";
}

function getStudentInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getSubjectColor(subject?: string | null): string {
  return (
    SUBJECT_COLORS[String(subject ?? "").toLowerCase()] ??
    "oklch(0.58 0.16 155)"
  );
}

function adaptStudent(student: AdminStudent): Student {
  return {
    id: student.id,
    name: student.name,
    email: student.parent?.user?.email ?? "—",
    grade: student.grade,
    parentName:
      student.parentName ||
      `${student.parent?.firstName ?? ""} ${student.parent?.lastName ?? ""}`.trim() ||
      "—",
    status: student.deletedAt ? "inactifs" : "actifs",
    enrolledSubjects: student.enrolledSubjects,
    avgScore: student.avgScore,
    attendanceRate: student.attendanceRate,
    joinedDate: "—",
    age: 0,
  };
}

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
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="dash-card p-4 flex flex-col gap-3">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ background: bg }}
      >
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div>
        <p className="text-xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-[11px] text-muted-foreground/70">{sub}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: studentData, isLoading } = useStudentDetail(id);
  const deactivateStudent = useDeactivateStudent();
  const reactivateStudent = useReactivateStudent();
  const [confirmAction, setConfirmAction] = useState<
    "activate" | "deactivate" | null
  >(null);
  if (!isLoading && !studentData) notFound();
  if (!studentData) {
    return <div className="p-8 text-sm text-muted-foreground">Chargement…</div>;
  }

  const currentStudent = adaptStudent(studentData);
  const initials = getStudentInitials(currentStudent.name);
  const avgColor = scoreColor(currentStudent.avgScore);
  const attendanceCol = scoreColor(currentStudent.attendanceRate);

  const handleActivate = async () => {
    await reactivateStudent.mutateAsync(id).catch(() => {});
    setConfirmAction(null);
  };

  const handleDeactivate = async () => {
    await deactivateStudent.mutateAsync(id).catch(() => {});
    setConfirmAction(null);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background px-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/students">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 rounded-xl text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Étudiants
            </Button>
          </Link>
          <span className="text-border/80">/</span>
          <span className="text-sm font-medium text-foreground">
            {currentStudent.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentStudent.status === "actifs" && (
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
          {currentStudent.status === "inactifs" && (
            <Button
              size="sm"
              className="gap-1.5 rounded-xl text-white"
              style={{ background: "oklch(0.58 0.16 155)" }}
              onClick={() => setConfirmAction("activate")}
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
            <div
              className="h-24 w-full"
              style={{
                background: `linear-gradient(135deg, ${STUDENT_COLOR}28 0%, ${STUDENT_COLOR}10 100%)`,
                borderBottom: `1px solid ${STUDENT_COLOR}20`,
              }}
            />
            <div className="px-6 pb-6">
              <div className="-mt-10 mb-4 flex items-end justify-between">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-md ring-4 ring-card"
                  style={{ background: STUDENT_COLOR }}
                >
                  {initials}
                </div>
                <StatusBadge status={currentStudent.status} />
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground">
                  {currentStudent.name}
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">
                    {currentStudent.grade}
                  </span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-sm text-muted-foreground">
                    {currentStudent.age} ans
                  </span>
                  <span className="text-muted-foreground/40">·</span>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {currentStudent.parentName}
                  </div>
                </div>
              </div>

              {/* Contact & info pills */}
              <div className="mt-5 flex flex-wrap gap-2">
                <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-xs text-foreground/70">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  {currentStudent.email}
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-xs text-foreground/70">
                  <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                  Inscrit {currentStudent.joinedDate}
                </div>
                <Link
                  href={`/dashboard/parents`}
                  className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-xs text-foreground/70 hover:bg-muted/60 transition-colors"
                >
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  {currentStudent.parentName}
                </Link>
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={BookOpen}
              label="Matières inscrites"
              value={currentStudent.enrolledSubjects.length || "—"}
              sub={
                currentStudent.enrolledSubjects.length > 0
                  ? currentStudent.enrolledSubjects.join(", ")
                  : "aucune matière"
              }
              color={STUDENT_COLOR}
              bg="oklch(0.95 0.03 80)"
            />
            <StatCard
              icon={Award}
              label="Moyenne générale"
              value={
                currentStudent.avgScore > 0
                  ? `${currentStudent.avgScore}%`
                  : "—"
              }
              sub={
                currentStudent.avgScore >= 90
                  ? "Excellent"
                  : currentStudent.avgScore >= 75
                    ? "Bien"
                    : currentStudent.avgScore >= 60
                      ? "Passable"
                      : "À améliorer"
              }
              color={avgColor}
              bg={`${avgColor}18`}
            />
            <StatCard
              icon={TrendingUp}
              label="Taux de présence"
              value={
                currentStudent.attendanceRate > 0
                  ? `${currentStudent.attendanceRate}%`
                  : "—"
              }
              sub="des cours suivis"
              color={attendanceCol}
              bg={`${attendanceCol}18`}
            />
            <StatCard
              icon={CalendarDays}
              label="Inscrit depuis"
              value={currentStudent.joinedDate}
              sub={`ID: ${currentStudent.id.toUpperCase()}`}
              color="oklch(0.52 0.14 250)"
              bg="oklch(0.93 0.02 250)"
            />
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left col — 2/3 */}
            <div className="lg:col-span-2 space-y-6">
              {/* Performance */}
              <div className="dash-card p-5">
                <h2 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4" style={{ color: STUDENT_COLOR }} />
                  Performance
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-muted-foreground">
                        Moyenne générale
                      </span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: avgColor }}
                      >
                        {currentStudent.avgScore > 0
                          ? `${currentStudent.avgScore}%`
                          : "—"}
                      </span>
                    </div>
                    {currentStudent.avgScore > 0 && (
                      <ScoreBar
                        value={currentStudent.avgScore}
                        color={avgColor}
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-muted-foreground">
                        Taux de présence
                      </span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: attendanceCol }}
                      >
                        {currentStudent.attendanceRate > 0
                          ? `${currentStudent.attendanceRate}%`
                          : "—"}
                      </span>
                    </div>
                    {currentStudent.attendanceRate > 0 && (
                      <ScoreBar
                        value={currentStudent.attendanceRate}
                        color={attendanceCol}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Enrolled subjects */}
              <div className="dash-card p-5">
                <h2 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
                  <BookOpen
                    className="h-4 w-4"
                    style={{ color: STUDENT_COLOR }}
                  />
                  Matières inscrites
                </h2>
                {currentStudent.enrolledSubjects.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentStudent.enrolledSubjects.map((subject) => {
                      const color = getSubjectColor(subject);
                      return (
                        <span
                          key={subject}
                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                          style={{
                            background: `${color}18`,
                            color,
                            border: `1px solid ${color}30`,
                          }}
                        >
                          <BookOpen className="h-3 w-3" />
                          {subject}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <BookOpen className="h-8 w-8 text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Aucune matière inscrite pour l&apos;instant
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right col — 1/3 */}
            <div className="space-y-6">
              {/* Account info */}
              <div className="dash-card p-5 space-y-3">
                <h2 className="text-sm font-semibold text-foreground">
                  Informations du compte
                </h2>
                {[
                  { label: "Nom complet", value: currentStudent.name },
                  { label: "Classe", value: currentStudent.grade },
                  { label: "Âge", value: `${currentStudent.age} ans` },
                  { label: "Inscrit depuis", value: currentStudent.joinedDate },
                  {
                    label: "ID étudiant",
                    value: currentStudent.id.toUpperCase(),
                  },
                  { label: "Parent", value: currentStudent.parentName },
                ].map(({ label, value }, index) => (
                  <div
                    key={`${label}-${index}`}
                    className="flex items-start justify-between gap-4"
                  >
                    <span className="text-xs text-muted-foreground shrink-0">
                      {label}
                    </span>
                    <span className="text-xs font-medium text-foreground text-right">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Parent link */}
              <div className="dash-card p-5">
                <h2 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Parent
                </h2>
                <div className="flex items-center gap-3 rounded-xl border border-border/50 px-3 py-2.5">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: "oklch(0.52 0.14 250)" }}
                  >
                    {getStudentInitials(currentStudent.parentName)}
                  </div>
                  <span className="text-sm font-medium text-foreground flex-1 min-w-0 truncate">
                    {currentStudent.parentName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activate confirmation */}
      <Modal
        open={confirmAction === "activate"}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        type="confirmation"
        title="Réactiver l'étudiant"
        description={`Êtes-vous sûr de vouloir réactiver le compte de ${currentStudent.name} ?`}
        size="sm"
        actions={{
          primary: {
            label: "Oui, réactiver",
            onClick: handleActivate,
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
            style={{ background: STUDENT_COLOR }}
          >
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium">{currentStudent.name}</p>
            <p className="text-xs text-muted-foreground">
              {currentStudent.grade} · {currentStudent.parentName}
            </p>
          </div>
        </div>
      </Modal>

      {/* Deactivate confirmation */}
      <Modal
        open={confirmAction === "deactivate"}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        type="warning"
        title="Désactiver l'étudiant"
        description={`${currentStudent.name} perdra l&apos;accès à la plateforme. Vous pouvez le/la réactiver à tout moment.`}
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
        <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: STUDENT_COLOR }}
          >
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium">{currentStudent.name}</p>
            <p className="text-xs text-muted-foreground">
              {currentStudent.grade} · {currentStudent.parentName}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
