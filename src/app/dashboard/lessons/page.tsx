"use client";

import { LessonForm } from "./lesson-form";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateLesson,
  useDeleteLesson,
  useLessons,
  useUpdateLesson,
} from "@/hooks/lessons";
import type { Lesson, LessonAuthor } from "@/hooks/lessons/api";
import { useSubjects } from "@/hooks/subjects";
import {
  BookOpen,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const LESSONS_COLOR = "oklch(0.55 0.16 165)";

function authorLabel(author: LessonAuthor | null | undefined): string {
  if (!author) return "—";
  const profile = author.tutor ?? author.parent ?? null;
  const name = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim()
    : "";
  if (name) return name;
  return author.email;
}

function authorRoleLabel(role: string | undefined): string {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "TUTOR":
      return "Tuteur";
    case "PARENT":
      return "Parent";
    default:
      return role ?? "";
  }
}

function LessonRowActions({
  lesson,
  onEdit,
  onDelete,
}: {
  lesson: Lesson;
  onEdit: (l: Lesson) => void;
  onDelete: (l: Lesson) => void;
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
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          className="gap-2 text-sm"
          onClick={() => onEdit(lesson)}
        >
          <Pencil className="h-3.5 w-3.5" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-sm text-destructive focus:text-destructive"
          onClick={() => onDelete(lesson)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LessonsTableSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export default function LessonsPage() {
  const { data: lessons = [], isLoading } = useLessons();
  const { data: subjects = [] } = useSubjects();
  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  const deleteLesson = useDeleteLesson();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [createOpen, setCreateOpen] = useState(false);
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lesson | null>(null);

  // Auto-open edit modal when ?edit=<id> is present (e.g. from tutor page).
  useEffect(() => {
    const editId = searchParams.get("edit");
    if (!editId || lessons.length === 0) return;
    const target = lessons.find((l) => l.id === editId);
    if (!target) return;
    const handle = setTimeout(() => {
      setEditLesson(target);
      router.replace("/dashboard/lessons");
    }, 0);
    return () => clearTimeout(handle);
  }, [searchParams, lessons, router]);

  const subjectMap = useMemo(() => {
    const m = new Map<string, { name: string; color: string }>();
    for (const s of subjects) m.set(s.id, { name: s.name, color: s.color });
    return m;
  }, [subjects]);

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteLesson.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  }

  const columns: ColumnDef<Lesson>[] = [
    {
      key: "title",
      label: "Titre",
      sortable: true,
      render: (l) => (
        <button
          type="button"
          onClick={() => setEditLesson(l)}
          className="text-left font-medium text-foreground hover:underline"
        >
          {l.title}
        </button>
      ),
    },
    {
      key: "subject",
      label: "Matière",
      render: (l) => {
        const s = subjectMap.get(l.subjectId);
        return (
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ background: s?.color ?? "#888" }}
            />
            <span className="text-sm text-muted-foreground">
              {s?.name ?? l.subjectId}
            </span>
          </div>
        );
      },
    },
    {
      key: "grade",
      label: "Niveau",
      sortable: true,
      render: (l) => (
        <span className="text-sm text-muted-foreground">{l.grade ?? "—"}</span>
      ),
    },
    {
      key: "creator",
      label: "Créateur",
      render: (l) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {authorLabel(l.user)}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {authorRoleLabel(l.user?.role)}
          </span>
        </div>
      ),
    },
    {
      key: "materials",
      label: "Contenus",
      render: (l) => (
        <span className="text-sm text-muted-foreground">
          {l.materials.length}
        </span>
      ),
    },
    {
      key: "series",
      label: "Série",
      render: (l) => (
        <span className="text-sm text-muted-foreground">
          {l.series?.title ?? "—"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Créée",
      sortable: true,
      render: (l) => (
        <span className="text-sm text-muted-foreground">
          {new Date(l.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (l) => (
        <LessonRowActions
          lesson={l}
          onEdit={setEditLesson}
          onDelete={setDeleteTarget}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/60 bg-background px-8 py-5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: "oklch(0.94 0.04 165)",
              color: LESSONS_COLOR,
            }}
          >
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Leçons</h1>
            <p className="text-sm text-muted-foreground">
              {isLoading ? (
                <span className="inline-flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Chargement…
                </span>
              ) : (
                `${lessons.length} leçon${lessons.length !== 1 ? "s" : ""}`
              )}
            </p>
          </div>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Ajouter une leçon
        </Button>
      </div>

      <div className="flex-1 overflow-auto px-8 py-6">
        {isLoading ? (
          <LessonsTableSkeleton />
        ) : (
          <DataTable
            data={lessons}
            columns={columns}
            searchKeys={["title", "description", "grade"]}
            searchPlaceholder="Rechercher une leçon…"
            itemsPerPage={20}
          />
        )}
      </div>

      {/* Create modal */}
      <Modal
        open={createOpen}
        onOpenChange={setCreateOpen}
        type="form"
        title="Ajouter une leçon"
        description="Créer une leçon disponible pour les parents et tuteurs."
        size="lg"
      >
        <LessonForm
          submitLabel={
            createLesson.isPending ? "Création..." : "Créer la leçon"
          }
          isPending={createLesson.isPending}
          onCancel={() => setCreateOpen(false)}
          onSubmit={async (value) => {
            await createLesson.mutateAsync(value);
            setCreateOpen(false);
          }}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={!!editLesson}
        onOpenChange={(open) => {
          if (!open) setEditLesson(null);
        }}
        type="form"
        title={editLesson?.title ?? "Modifier la leçon"}
        description={
          editLesson
            ? `Créée le ${new Date(editLesson.createdAt).toLocaleDateString("fr-FR")} par ${authorLabel(editLesson.user)}`
            : ""
        }
        size="lg"
      >
        {editLesson ? (
          <LessonForm
            initial={{
              title: editLesson.title,
              subjectId: editLesson.subjectId,
              grade: editLesson.grade ?? undefined,
              description: editLesson.description ?? undefined,
              materials: editLesson.materials.map((m) => ({
                title: m.title,
                resourceId: m.resourceId ?? undefined,
              })),
            }}
            submitLabel={
              updateLesson.isPending ? "Enregistrement..." : "Enregistrer"
            }
            isPending={updateLesson.isPending}
            onCancel={() => setEditLesson(null)}
            onSubmit={async (value) => {
              await updateLesson.mutateAsync({
                id: editLesson.id,
                ...value,
              });
              setEditLesson(null);
            }}
          />
        ) : null}
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        type="warning"
        title="Supprimer la leçon"
        description={`Êtes-vous sûr de vouloir supprimer "${deleteTarget?.title}" ? Cette action est irréversible.`}
        size="sm"
        actions={{
          primary: {
            label: deleteLesson.isPending ? "Suppression…" : "Supprimer",
            onClick: handleDelete,
            variant: "destructive",
            disabled: deleteLesson.isPending,
            loading: deleteLesson.isPending,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setDeleteTarget(null),
            variant: "outline",
          },
        }}
      >
        <p className="text-sm text-muted-foreground">
          Les sessions liées à cette leçon pourraient être affectées.
        </p>
      </Modal>
    </div>
  );
}
