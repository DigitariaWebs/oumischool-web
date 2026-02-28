"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ScheduleView } from "@/components/ui/schedule-view";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeactivateStudent,
  useReactivateStudent,
  useStudentDetail,
  useStudentSchedule,
} from "@/hooks/students";
import type { AdminStudent } from "@/hooks/students/api";
import {
  Student,
  TutorSchedule,
  SessionMode,
  SessionStatus,
  SessionType,
} from "@/types";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CalendarRange,
  CheckCircle2,
  GraduationCap,
  Mail,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";

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

interface StudentCalendarEvent {
  id: string;
  type: "session" | "event";
  title: string;
  subjectId: string | null;
  mode: string | null;
  startTime: string;
  endTime: string;
  status: string | null;
  tutorName: string | null;
  color: string | null;
  completed: boolean;
  allDay: boolean;
}

function normalizeStudentSchedule(
  studentId: string,
  events: StudentCalendarEvent[],
): TutorSchedule {
  const sessions = events
    .filter((e) => e.type === "session")
    .map((event) => {
      const startDate = new Date(event.startTime);
      const endDate = new Date(event.endTime);

      const statusRaw = event.status?.toUpperCase() ?? "SCHEDULED";
      const status: SessionStatus =
        statusRaw === "COMPLETED"
          ? "completed"
          : statusRaw === "CANCELLED" || statusRaw === "REJECTED"
            ? "cancelled"
            : "scheduled";

      return {
        id: event.id.replace("session:", ""),
        tutorId: "",
        subjectId: event.subjectId ?? "",
        title: event.title.replace("Session — ", ""),
        day: startDate.getDay(),
        startTime: `${String(startDate.getHours()).padStart(2, "0")}:${String(startDate.getMinutes()).padStart(2, "0")}`,
        endTime: `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`,
        mode: (event.mode === "presential"
          ? "presential"
          : "online") as SessionMode,
        type: "individual" as SessionType,
        status,
        students: event.tutorName
          ? [{ id: studentId, name: event.tutorName }]
          : [],
        recurringWeekly: false,
        date: event.startTime.split("T")[0],
      };
    });

  return {
    tutorId: studentId,
    sessions,
    availability: [],
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

function StudentOverviewTab({ student }: { student: Student }) {
  const avgColor = scoreColor(student.avgScore);
  const attendanceCol = scoreColor(student.attendanceRate);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Matières inscrites",
            value: student.enrolledSubjects.length || "—",
            sub:
              student.enrolledSubjects.length > 0
                ? student.enrolledSubjects.join(", ")
                : "aucune matière",
            icon: BookOpen,
            color: STUDENT_COLOR,
            bg: "oklch(0.95 0.03 80)",
          },
          {
            label: "Moyenne générale",
            value: student.avgScore > 0 ? `${student.avgScore}%` : "—",
            sub:
              student.avgScore >= 90
                ? "Excellent"
                : student.avgScore >= 75
                  ? "Bien"
                  : student.avgScore >= 60
                    ? "Passable"
                    : "À améliorer",
            icon: Award,
            color: avgColor,
            bg: `${avgColor}18`,
          },
          {
            label: "Taux de présence",
            value:
              student.attendanceRate > 0 ? `${student.attendanceRate}%` : "—",
            sub: "des cours suivis",
            icon: TrendingUp,
            color: attendanceCol,
            bg: `${attendanceCol}18`,
          },
          {
            label: "Classe",
            value: student.grade,
            sub: `${student.age} ans`,
            icon: GraduationCap,
            color: "oklch(0.52 0.14 250)",
            bg: "oklch(0.93 0.02 250)",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="dash-card p-4 flex flex-col gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl"
                style={{ background: stat.bg }}
              >
                <Icon className="h-4 w-4" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <p className="text-[11px] text-muted-foreground/70">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="dash-card p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          Informations du compte
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Nom complet", value: student.name },
            { label: "Classe", value: student.grade },
            { label: "Âge", value: `${student.age} ans` },
            {
              label: "ID étudiant",
              value: student.id.toUpperCase().slice(0, 8),
            },
            { label: "Parent", value: student.parentName },
            { label: "E-mail parent", value: student.email },
          ].map((item, index) => (
            <div key={`${item.label}-${index}`}>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                {item.label}
              </p>
              <p className="text-sm font-medium text-foreground mt-0.5 truncate">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentSubjectsTab({ student }: { student: Student }) {
  return (
    <div className="dash-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="h-4 w-4" style={{ color: STUDENT_COLOR }} />
          Matières inscrites
        </h2>
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-medium"
          style={{
            background: `${STUDENT_COLOR}15`,
            color: STUDENT_COLOR,
          }}
        >
          {student.enrolledSubjects.length}
        </span>
      </div>

      {student.enrolledSubjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground/30 mb-4" />
          <p className="text-sm font-medium text-foreground">
            Aucune matière inscrite
          </p>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs">
            Les matières auxquelles cet étudiant est inscrit apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {student.enrolledSubjects.map((subject) => {
              const color = getSubjectColor(subject);
              return (
                <span
                  key={subject}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
                  style={{
                    background: `${color}18`,
                    color,
                    border: `1px solid ${color}30`,
                  }}
                >
                  <BookOpen className="h-4 w-4" />
                  {subject}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StudentPerformanceTab({ student }: { student: Student }) {
  const avgColor = scoreColor(student.avgScore);
  const attendanceCol = scoreColor(student.attendanceRate);

  return (
    <div className="dash-card p-5">
      <h2 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
        <Award className="h-4 w-4" style={{ color: STUDENT_COLOR }} />
        Performance
      </h2>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground">
              Moyenne générale
            </span>
            <span className="text-xs font-semibold" style={{ color: avgColor }}>
              {student.avgScore > 0 ? `${student.avgScore}%` : "—"}
            </span>
          </div>
          {student.avgScore > 0 && (
            <ScoreBar value={student.avgScore} color={avgColor} />
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
              {student.attendanceRate > 0 ? `${student.attendanceRate}%` : "—"}
            </span>
          </div>
          {student.attendanceRate > 0 && (
            <ScoreBar value={student.attendanceRate} color={attendanceCol} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: studentData, isLoading } = useStudentDetail(id);
  const { data: scheduleData } = useStudentSchedule(id);
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
  const studentSchedule = normalizeStudentSchedule(id, scheduleData ?? []);

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
      <header
        className="shrink-0 border-b border-border/60 bg-background"
        style={{
          background: `linear-gradient(135deg, ${STUDENT_COLOR}0a 0%, transparent 60%)`,
        }}
      >
        <div className="flex h-11 items-center justify-between border-b border-border/40 px-6">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/students">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 rounded-lg px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Étudiants
              </Button>
            </Link>
            <span className="text-border/80 text-xs">/</span>
            <span className="text-xs font-medium text-foreground">
              {currentStudent.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {currentStudent.status === "actifs" && (
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
            {currentStudent.status === "inactifs" && (
              <Button
                size="sm"
                className="h-7 gap-1.5 rounded-lg px-3 text-xs text-white"
                style={{ background: "oklch(0.58 0.16 155)" }}
                onClick={() => setConfirmAction("activate")}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Réactiver
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-5 px-6 py-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white shadow-sm"
            style={{ background: STUDENT_COLOR }}
          >
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-base font-bold text-foreground leading-none">
                {currentStudent.name}
              </h1>
              <StatusBadge status={currentStudent.status} />
            </div>
            <div className="mt-1.5 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <GraduationCap className="h-3 w-3" />
                {currentStudent.grade}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                {currentStudent.parentName}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Mail className="h-3 w-3" />
                {currentStudent.email}
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/60 px-3 py-2">
              <BookOpen
                className="h-3.5 w-3.5"
                style={{ color: STUDENT_COLOR }}
              />
              <span className="text-sm font-bold text-foreground">
                {currentStudent.enrolledSubjects.length}
              </span>
              <span className="text-xs text-muted-foreground">matières</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/60 px-3 py-2">
              <Award
                className="h-3.5 w-3.5"
                style={{ color: scoreColor(currentStudent.avgScore) }}
              />
              <span className="text-sm font-bold text-foreground">
                {currentStudent.avgScore > 0
                  ? `${currentStudent.avgScore}%`
                  : "—"}
              </span>
              <span className="text-xs text-muted-foreground">moyenne</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/60 px-3 py-2">
              <TrendingUp
                className="h-3.5 w-3.5"
                style={{ color: scoreColor(currentStudent.attendanceRate) }}
              />
              <span className="text-sm font-bold text-foreground">
                {currentStudent.attendanceRate > 0
                  ? `${currentStudent.attendanceRate}%`
                  : "—"}
              </span>
              <span className="text-xs text-muted-foreground">présence</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList
              variant="line"
              className="w-full justify-start border-b border-border/60 rounded-none pb-0 h-auto"
            >
              <TabsTrigger value="overview" className="gap-1.5 pb-3">
                <Users className="h-3.5 w-3.5" />
                Vue générale
              </TabsTrigger>
              <TabsTrigger value="subjects" className="gap-1.5 pb-3">
                <BookOpen className="h-3.5 w-3.5" />
                Matières
                <span
                  className="rounded-full px-1.5 py-0 text-[10px] font-semibold"
                  style={{
                    background: `${STUDENT_COLOR}15`,
                    color: STUDENT_COLOR,
                  }}
                >
                  {currentStudent.enrolledSubjects.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="gap-1.5 pb-3">
                <Award className="h-3.5 w-3.5" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="schedule" className="gap-1.5 pb-3">
                <CalendarRange className="h-3.5 w-3.5" />
                Planning
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <StudentOverviewTab student={currentStudent} />
            </TabsContent>

            <TabsContent value="subjects">
              <StudentSubjectsTab student={currentStudent} />
            </TabsContent>

            <TabsContent value="performance">
              <StudentPerformanceTab student={currentStudent} />
            </TabsContent>

            <TabsContent value="schedule" className="mt-6">
              <ScheduleView
                schedule={studentSchedule}
                getSubjectColor={getSubjectColor}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

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
