"use client";

import type { ColumnDef } from "@/components/ui/DataTable";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParents } from "@/hooks/parents";
import {
  useCreateStudent,
  useDeactivateStudent,
  useReactivateStudent,
  useStudents,
} from "@/hooks/students";
import type { AdminStudent } from "@/hooks/students/api";
import { Student } from "@/types";
import {
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Eye,
  GraduationCap,
  Loader2,
  Mail,
  MoreHorizontal,
  Plus,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

function StudentQuickView({ student }: { student: Student }) {
  const initials = getStudentInitials(student.name);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-sm"
          style={{ background: STUDENT_COLOR }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-foreground">
              {student.name}
            </h3>
            <StatusBadge status={student.status} />
          </div>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className="text-sm text-muted-foreground">
              {student.grade}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-xs text-muted-foreground">
              {student.parentName}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Matières",
            value: student.enrolledSubjects.length || "—",
            icon: BookOpen,
            color: STUDENT_COLOR,
            bg: "oklch(0.95 0.03 80)",
          },
          {
            label: "Moyenne",
            value: student.avgScore > 0 ? `${student.avgScore}%` : "—",
            icon: Award,
            color: scoreColor(student.avgScore),
            bg: `${scoreColor(student.avgScore)}18`,
          },
          {
            label: "Présence",
            value:
              student.attendanceRate > 0 ? `${student.attendanceRate}%` : "—",
            icon: TrendingUp,
            color: scoreColor(student.attendanceRate),
            bg: `${scoreColor(student.attendanceRate)}18`,
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1.5 rounded-xl p-3"
              style={{ background: s.bg }}
            >
              <Icon className="h-4 w-4" style={{ color: s.color }} />
              <span
                className="text-sm font-bold text-center"
                style={{ color: s.color }}
              >
                {s.value}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Mail, label: student.email },
          { icon: Users, label: student.parentName },
          { icon: GraduationCap, label: student.grade },
          { icon: CalendarDays, label: student.joinedDate },
        ].map(({ icon: Icon, label }, index) => (
          <div
            key={`${label}-${index}`}
            className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5"
          >
            <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="text-xs text-foreground/80 truncate">{label}</span>
          </div>
        ))}
      </div>

      {student.enrolledSubjects.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
            Matières inscrites
          </p>
          <div className="flex flex-wrap gap-2">
            {student.enrolledSubjects.map((subject) => {
              const color = getSubjectColor(subject);
              return (
                <span
                  key={subject}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
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
        </div>
      )}
    </div>
  );
}

function StudentActions({
  student,
  onView,
  onActivate,
  onDeactivate,
}: {
  student: Student;
  onView: (s: Student) => void;
  onActivate?: (s: Student) => void;
  onDeactivate?: (s: Student) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 rounded-lg p-0 text-muted-foreground hover:text-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem
          className="gap-2 text-xs"
          onClick={() => onView(student)}
        >
          <Eye className="h-3.5 w-3.5" />
          Aperçu rapide
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-xs" asChild>
          <Link href={`/dashboard/students/${student.id}`}>
            <ExternalLink className="h-3.5 w-3.5" />
            Profil complet
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {student.status === "inactifs" && onActivate && (
          <DropdownMenuItem
            className="gap-2 text-xs text-green-700 focus:text-green-700 focus:bg-green-50"
            onClick={() => onActivate(student)}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Activer
          </DropdownMenuItem>
        )}
        {student.status === "actifs" && onDeactivate && (
          <DropdownMenuItem
            className="gap-2 text-xs text-red-600 focus:text-red-600 focus:bg-red-50"
            onClick={() => onDeactivate(student)}
          >
            <XCircle className="h-3.5 w-3.5" />
            Désactiver
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function buildColumns(
  onView: (s: Student) => void,
  onActivate?: (s: Student) => void,
  onDeactivate?: (s: Student) => void,
): ColumnDef<Student>[] {
  return [
    {
      key: "name",
      label: "Étudiant",
      sortable: true,
      render: (student) => {
        const initials = getStudentInitials(student.name);
        return (
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: STUDENT_COLOR }}
            >
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {student.name}
              </p>
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Mail className="h-3 w-3" />
                {student.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "grade",
      label: "Classe",
      sortable: true,
      render: (student) => (
        <div>
          <span className="text-sm font-medium text-foreground">
            {student.grade}
          </span>
          <p className="text-[11px] text-muted-foreground">Âge {student.age}</p>
        </div>
      ),
    },
    {
      key: "parentName",
      label: "Parent",
      sortable: true,
      render: (student) => (
        <span className="text-sm text-muted-foreground">
          {student.parentName}
        </span>
      ),
    },
    {
      key: "enrolledSubjects",
      label: "Matières",
      sortable: false,
      render: (student) => {
        const subjects = student.enrolledSubjects;
        if (!subjects.length)
          return <span className="text-xs text-muted-foreground">—</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {subjects.slice(0, 2).map((s) => {
              const color = getSubjectColor(s);
              return (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    background: `${color}18`,
                    color,
                    border: `1px solid ${color}30`,
                  }}
                >
                  {s}
                </span>
              );
            })}
            {subjects.length > 2 && (
              <span className="text-[10px] text-muted-foreground self-center">
                +{subjects.length - 2}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "avgScore",
      label: "Moyenne",
      sortable: true,
      render: (student) => {
        const score = student.avgScore;
        if (!score)
          return <span className="text-xs text-muted-foreground">—</span>;
        return (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${score}%`,
                  background: scoreColor(score),
                }}
              />
            </div>
            <span
              className="text-xs font-semibold"
              style={{ color: scoreColor(score) }}
            >
              {score}%
            </span>
          </div>
        );
      },
    },
    {
      key: "attendanceRate",
      label: "Présence",
      sortable: true,
      render: (student) => {
        const rate = student.attendanceRate;
        if (!rate)
          return <span className="text-xs text-muted-foreground">—</span>;
        return (
          <div className="flex items-center gap-1">
            <TrendingUp
              className="h-3.5 w-3.5"
              style={{ color: scoreColor(rate) }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: scoreColor(rate) }}
            >
              {rate}%
            </span>
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (student) => <StatusBadge status={student.status} />,
    },
    {
      key: "joinedDate",
      label: "Inscrit",
      sortable: true,
      render: (student) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          {student.joinedDate}
        </div>
      ),
    },
    {
      key: "id",
      label: "Actions",
      sortable: false,
      render: (student) => (
        <StudentActions
          student={student}
          onView={onView}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
        />
      ),
    },
  ];
}

const filters = [
  {
    key: "status",
    label: "Statut",
    options: [
      { label: "Actif", value: "actifs" },
      { label: "Inactif", value: "inactifs" },
      { label: "Diplômé", value: "graduated" },
    ],
  },
  {
    key: "grade",
    label: "Classe",
    options: Array.from({ length: 9 }, (_, i) => ({
      label: `Classe ${i + 1}`,
      value: `Classe ${i + 1}`,
    })),
  },
];

const defaultFormState: {
  name: string;
  grade: string;
  parentId: string;
  dateOfBirth: string;
} = {
  name: "",
  grade: "",
  parentId: "",
  dateOfBirth: "",
};

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{ background: "oklch(0.95 0.018 155)" }}
      >
        <CheckCircle2
          className="h-7 w-7"
          style={{ color: "oklch(0.58 0.16 155)" }}
        />
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export default function EtudiantsPage() {
  const router = useRouter();
  const { data: studentsData = [], isLoading } = useStudents();
  const { data: parentsData = [] } = useParents();
  const createStudent = useCreateStudent();
  const activateStudent = useReactivateStudent();
  const deactivateStudent = useDeactivateStudent();

  const [addOpen, setAddOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [form, setForm] = useState(defaultFormState);

  const students = studentsData.map(adaptStudent);

  const activeStudents = students.filter((s) => s.status === "actifs");
  const inactiveStudents = students.filter((s) => s.status === "inactifs");

  const handleAdd = async () => {
    if (!form.name || !form.grade || !form.parentId) return;
    await createStudent.mutateAsync({
      parentId: form.parentId,
      name: form.name,
      grade: form.grade,
      dateOfBirth: form.dateOfBirth || undefined,
    });
    setForm(defaultFormState);
    setAddOpen(false);
  };

  const handleActivate = async (student: Student) => {
    await activateStudent.mutateAsync(student.id).catch(() => {});
  };

  const handleDeactivate = async (student: Student) => {
    await deactivateStudent.mutateAsync(student.id).catch(() => {});
  };

  const columns = buildColumns(
    setViewStudent,
    handleActivate,
    handleDeactivate,
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background px-6">
        <div>
          <h1 className="flex items-center gap-2 text-base font-semibold text-foreground tracking-tight">
            <Users className="h-4 w-4 text-muted-foreground" />
            Étudiants
          </h1>
          <p className="text-xs text-muted-foreground">
            {students.length} étudiants · {activeStudents.length} actifs
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 rounded-xl text-white"
          style={{ background: STUDENT_COLOR }}
          onClick={() => setAddOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Ajouter étudiant
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="all" className="h-full">
          <TabsList
            variant="line"
            className="w-full justify-start border-b border-border/60 rounded-none pb-0 h-auto bg-background px-6"
          >
            <TabsTrigger value="all" className="gap-1.5 pb-3">
              Tous les étudiants
              <span
                className="rounded-full px-1.5 py-0 text-[10px] font-semibold"
                style={{
                  background: "oklch(0.94 0.008 80)",
                  color: "oklch(0.48 0.02 250)",
                }}
              >
                {students.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="active" className="gap-1.5 pb-3">
              Actifs
              <span
                className="rounded-full px-1.5 py-0 text-[10px] font-semibold"
                style={{
                  background: "oklch(0.95 0.018 155)",
                  color: "oklch(0.38 0.12 155)",
                }}
              >
                {activeStudents.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="inactive" className="gap-1.5 pb-3">
              Inactifs
              <span
                className="rounded-full px-1.5 py-0 text-[10px] font-semibold"
                style={{
                  background: "oklch(0.94 0.008 80)",
                  color: "oklch(0.48 0.02 250)",
                }}
              >
                {inactiveStudents.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : students.length === 0 ? (
              <EmptyState
                title="Aucun étudiant"
                description="Aucun étudiant n'a encore été inscrit sur la plateforme."
              />
            ) : (
              <DataTable
                data={students}
                columns={columns}
                filters={filters}
                searchKeys={["name", "email", "grade", "parentName"]}
                itemsPerPage={8}
                onRowClick={setViewStudent}
              />
            )}
          </TabsContent>

          <TabsContent value="active" className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : activeStudents.length === 0 ? (
              <EmptyState
                title="Aucun étudiant actif"
                description="Aucun étudiant actif pour le moment."
              />
            ) : (
              <DataTable
                data={activeStudents}
                columns={columns}
                filters={filters}
                searchKeys={["name", "email", "grade", "parentName"]}
                itemsPerPage={8}
                onRowClick={setViewStudent}
              />
            )}
          </TabsContent>

          <TabsContent value="inactive" className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : inactiveStudents.length === 0 ? (
              <EmptyState
                title="Aucun étudiant inactif"
                description="Tous les étudiants sont actifs."
              />
            ) : (
              <DataTable
                data={inactiveStudents}
                columns={columns}
                filters={filters}
                searchKeys={["name", "email", "grade", "parentName"]}
                itemsPerPage={8}
                onRowClick={setViewStudent}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Modal
        open={!!viewStudent}
        onOpenChange={(open) => !open && setViewStudent(null)}
        type="details"
        title="Profil de l'étudiant"
        description="Aperçu rapide — ouvrez le profil complet pour tous les détails."
        size="md"
        icon={null}
        actions={{
          primary: viewStudent
            ? {
                label: "Ouvrir le profil complet",
                onClick: () => {
                  router.push(`/dashboard/students/${viewStudent.id}`);
                },
                icon: <ExternalLink className="h-3.5 w-3.5" />,
              }
            : undefined,
          secondary: {
            label: "Fermer",
            onClick: () => setViewStudent(null),
            variant: "outline",
          },
        }}
      >
        {viewStudent && <StudentQuickView student={viewStudent} />}
      </Modal>

      <Modal
        open={addOpen}
        onOpenChange={setAddOpen}
        type="form"
        title="Ajouter un nouvel étudiant"
        description="Inscrire un nouvel étudiant. Liez-le à un compte parent pour gérer son apprentissage."
        size="md"
        actions={{
          primary: {
            label: createStudent.isPending
              ? "Ajout en cours…"
              : "Ajouter étudiant",
            onClick: handleAdd,
          },
          secondary: {
            label: "Annuler",
            onClick: () => {
              setForm(defaultFormState);
              setAddOpen(false);
            },
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="student-name">Nom complet</Label>
              <Input
                id="student-name"
                placeholder="e.g. Lucas Gavi"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Parent</Label>
              <Select
                value={form.parentId}
                onValueChange={(v) => setForm((f) => ({ ...f, parentId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un parent" />
                </SelectTrigger>
                <SelectContent>
                  {parentsData.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.firstName} {parent.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Grade</Label>
              <Select
                value={form.grade}
                onValueChange={(v) => setForm((f) => ({ ...f, grade: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 9 }, (_, i) => `Grade ${i + 1}`).map(
                    (g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="student-dob">Date de naissance</Label>
              <Input
                id="student-dob"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dateOfBirth: e.target.value }))
                }
              />
            </div>
          </div>
          {createStudent.isError && (
            <p className="text-xs text-destructive">
              Impossible de créer l&apos;étudiant.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
