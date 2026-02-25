"use client";

import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
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
import { useParents } from "@/hooks/parents";
import { useCreateStudent, useStudents } from "@/hooks/students";
import type { AdminStudent } from "@/hooks/students/api";
import { Student } from "@/types";
import {
  Users,
  Plus,
  Mail,
  BookOpen,
  TrendingUp,
  Award,
  CalendarDays,
} from "lucide-react";
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

const columns: ColumnDef<Student>[] = [
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
            style={{ background: "oklch(0.62 0.16 80)" }}
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
        return <span className="text-xs text-muted-foreground">None</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {subjects.slice(0, 2).map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{
                background: `${getSubjectColor(s)}18`,
                color: getSubjectColor(s),
                border: `1px solid ${getSubjectColor(s)}30`,
              }}
            >
              {s}
            </span>
          ))}
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
];

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
    options: [
      { label: "Classe 1", value: "Classe 1" },
      { label: "Classe 2", value: "Classe 2" },
      { label: "Classe 3", value: "Classe 3" },
      { label: "Classe 4", value: "Classe 4" },
      { label: "Classe 5", value: "Classe 5" },
      { label: "Classe 6", value: "Classe 6" },
      { label: "Classe 7", value: "Classe 7" },
      { label: "Classe 8", value: "Classe 8" },
      { label: "Classe 9", value: "Classe 9" },
    ],
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

export default function EtudiantsPage() {
  const { data: studentsData = [], isLoading } = useStudents();
  const { data: parentsData = [] } = useParents();
  const createStudent = useCreateStudent();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultFormState);
  const étudiants = studentsData.map(adaptStudent);

  const actifsCount = étudiants.filter((s) => s.status === "actifs").length;
  const scoredStudents = étudiants.filter((s) => s.avgScore > 0);
  const avgScore =
    scoredStudents.reduce((acc, s) => acc + s.avgScore, 0) /
    (scoredStudents.length || 1);
  const bestStudent = scoredStudents.reduce<Student | null>(
    (top, student) => (!top || student.avgScore > top.avgScore ? student : top),
    null,
  );
  const bestStudentName = bestStudent?.name ?? "—";

  const handleAdd = async () => {
    if (!form.name || !form.grade || !form.parentId) return;
    await createStudent.mutateAsync({
      parentId: form.parentId,
      name: form.name,
      grade: form.grade,
      dateOfBirth: form.dateOfBirth || undefined,
    });
    setForm(defaultFormState);
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background px-6">
        <div>
          <h1 className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            Étudiants
          </h1>
          <p className="text-xs text-muted-foreground">
            {étudiants.length} étudiants &middot; {actifsCount} actifs
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 rounded-xl text-white"
          style={{ background: STUDENT_COLOR }}
          onClick={() => setModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Ajouter étudiant
        </Button>
      </header>

      {/* Summary bar */}
      <div className="flex items-center gap-4 border-b border-border/40 bg-background px-6 py-2.5">
        <div className="flex items-center gap-2">
          <BookOpen
            className="h-3.5 w-3.5"
            style={{ color: "oklch(0.58 0.16 155)" }}
          />
          <span className="text-xs text-muted-foreground">
            Matières totales inscrites:{" "}
            <strong className="text-foreground">
              {étudiants.reduce((a, s) => a + s.enrolledSubjects.length, 0)}
            </strong>
          </span>
        </div>
        <div className="h-3.5 w-px bg-border/60" />
        <div className="flex items-center gap-2">
          <Award
            className="h-3.5 w-3.5"
            style={{ color: "oklch(0.72 0.14 80)" }}
          />
          <span className="text-xs text-muted-foreground">
            Moyenne plateforme:{" "}
            <strong
              className="font-semibold"
              style={{ color: scoreColor(avgScore) }}
            >
              {avgScore.toFixed(1)}%
            </strong>
          </span>
        </div>
        <div className="h-3.5 w-px bg-border/60" />
        <div className="flex items-center gap-2">
          <TrendingUp
            className="h-3.5 w-3.5"
            style={{ color: "oklch(0.65 0.12 220)" }}
          />
          <span className="text-xs text-muted-foreground">
            Meilleur étudiant:{" "}
            <strong className="text-foreground">{bestStudentName}</strong>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Chargement des étudiants…
          </div>
        ) : (
          <DataTable
            data={étudiants}
            columns={columns}
            filters={filters}
            searchKeys={["name", "email", "grade", "parentName"]}
            itemsPerPage={8}
          />
        )}
      </div>

      {/* Ajouter étudiant Modal */}
      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        type="form"
        title="Ajouter un nouvel étudiant"
        description="Inscrire un nouvel étudiant. Liez-le à un compte parent pour gérer son apprentissage."
        size="md"
        actions={{
          primary: {
            label: "Ajouter étudiant",
            onClick: handleAdd,
          },
          secondary: {
            label: "Cancel",
            onClick: () => {
              setForm(defaultFormState);
              setModalOpen(false);
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
