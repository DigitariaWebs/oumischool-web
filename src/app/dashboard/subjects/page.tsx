"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import {
  useCreateSubject,
  useDeleteSubject,
  useSubjects,
  useUpdateSubject,
} from "@/hooks/subjects";
import type { AdminSubject } from "@/hooks/subjects/api";
import {
  BookOpen,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const SUBJECT_COLOR = "oklch(0.52 0.14 250)";

interface SubjectForm {
  name: string;
  color: string;
  icon: string;
}

const defaultForm: SubjectForm = {
  name: "",
  color: "#3B82F6",
  icon: "",
};

function SubjectRow({
  subject,
  onEdit,
  onDelete,
}: {
  subject: AdminSubject;
  onEdit: (s: AdminSubject) => void;
  onDelete: (s: AdminSubject) => void;
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
          onClick={() => onEdit(subject)}
        >
          <Pencil className="h-3.5 w-3.5" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-sm text-destructive focus:text-destructive"
          onClick={() => onDelete(subject)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded-md border border-input p-0.5"
          title="Choisir une couleur"
        />
      </div>
      <Input
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
        }}
        placeholder="#3B82F6"
        className="font-mono w-32"
        maxLength={7}
      />
      <div
        className="h-9 w-9 shrink-0 rounded-md border border-border"
        style={{ background: value }}
      />
    </div>
  );
}

export default function SubjectsPage() {
  const { data: subjects = [], isLoading } = useSubjects();
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();
  const deleteSubject = useDeleteSubject();

  const [addOpen, setAddOpen] = useState(false);
  const [editSubject, setEditSubject] = useState<AdminSubject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminSubject | null>(null);
  const [form, setForm] = useState<SubjectForm>(defaultForm);
  const [editForm, setEditForm] = useState<SubjectForm>(defaultForm);

  function openEdit(s: AdminSubject) {
    setEditSubject(s);
    setEditForm({ name: s.name, color: s.color, icon: s.icon ?? "" });
  }

  async function handleCreate() {
    if (!form.name.trim() || !/^#[0-9A-Fa-f]{6}$/.test(form.color)) return;
    await createSubject.mutateAsync({
      name: form.name.trim(),
      color: form.color,
      icon: form.icon.trim() || undefined,
    });
    setForm(defaultForm);
    setAddOpen(false);
  }

  async function handleEdit() {
    if (!editSubject) return;
    if (!editForm.name.trim() || !/^#[0-9A-Fa-f]{6}$/.test(editForm.color))
      return;
    await updateSubject.mutateAsync({
      id: editSubject.id,
      name: editForm.name.trim(),
      color: editForm.color,
      icon: editForm.icon.trim() || undefined,
    });
    setEditSubject(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteSubject.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  }

  const columns: ColumnDef<AdminSubject>[] = [
    {
      key: "name",
      label: "Matière",
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 shrink-0 rounded-full"
            style={{ background: s.color }}
          />
          <span className="font-medium text-foreground">{s.name}</span>
        </div>
      ),
    },
    {
      key: "color",
      label: "Couleur",
      render: (s) => (
        <span className="font-mono text-xs text-muted-foreground">
          {s.color}
        </span>
      ),
    },
    {
      key: "icon",
      label: "Icône",
      render: (s) => (
        <span className="font-mono text-xs text-muted-foreground">
          {s.icon ?? "—"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Créée le",
      sortable: true,
      render: (s) => (
        <span className="text-sm text-muted-foreground">
          {new Date(s.createdAt).toLocaleDateString("fr-FR", {
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
      render: (s) => (
        <SubjectRow subject={s} onEdit={openEdit} onDelete={setDeleteTarget} />
      ),
    },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 bg-background px-8 py-5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: "oklch(0.93 0.02 250)",
              color: SUBJECT_COLOR,
            }}
          >
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Matières</h1>
            <p className="text-sm text-muted-foreground">
              {isLoading ? (
                <span className="inline-flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Chargement…
                </span>
              ) : (
                `${subjects.length} matière${subjects.length !== 1 ? "s" : ""}`
              )}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => {
            setForm(defaultForm);
            setAddOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Ajouter une matière
        </Button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <DataTable
          data={subjects}
          columns={columns}
          searchKeys={["name", "icon"]}
          searchPlaceholder="Rechercher une matière…"
          itemsPerPage={10}
        />
      </div>

      {/* Create Modal */}
      <Modal
        open={addOpen}
        onOpenChange={setAddOpen}
        type="form"
        title="Ajouter une matière"
        description="Créer une nouvelle matière avec une couleur et une icône."
        size="md"
        actions={{
          primary: {
            label: createSubject.isPending ? "Ajout…" : "Ajouter",
            onClick: handleCreate,
            disabled: createSubject.isPending,
            loading: createSubject.isPending,
          },
          secondary: {
            label: "Annuler",
            onClick: () => {
              setForm(defaultForm);
              setAddOpen(false);
            },
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="subject-name">Nom</Label>
            <Input
              id="subject-name"
              placeholder="ex. Mathématiques"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Couleur</Label>
            <ColorInput
              value={form.color}
              onChange={(v) => setForm((f) => ({ ...f, color: v }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subject-icon">
              Icône{" "}
              <span className="text-muted-foreground font-normal">
                (optionnel)
              </span>
            </Label>
            <Input
              id="subject-icon"
              placeholder="ex. math, french, science"
              value={form.icon}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
            />
          </div>
          {createSubject.isError && (
            <p className="text-xs text-destructive">
              Impossible de créer la matière. Le nom est peut-être déjà utilisé.
            </p>
          )}
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editSubject}
        onOpenChange={(open) => {
          if (!open) setEditSubject(null);
        }}
        type="form"
        title="Modifier la matière"
        description={`Modifier les informations de "${editSubject?.name}".`}
        size="md"
        actions={{
          primary: {
            label: updateSubject.isPending ? "Enregistrement…" : "Enregistrer",
            onClick: handleEdit,
            disabled: updateSubject.isPending,
            loading: updateSubject.isPending,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setEditSubject(null),
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-subject-name">Nom</Label>
            <Input
              id="edit-subject-name"
              value={editForm.name}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, name: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Couleur</Label>
            <ColorInput
              value={editForm.color}
              onChange={(v) => setEditForm((f) => ({ ...f, color: v }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-subject-icon">
              Icône{" "}
              <span className="text-muted-foreground font-normal">
                (optionnel)
              </span>
            </Label>
            <Input
              id="edit-subject-icon"
              placeholder="ex. math, french, science"
              value={editForm.icon}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, icon: e.target.value }))
              }
            />
          </div>
          {updateSubject.isError && (
            <p className="text-xs text-destructive">
              Impossible de modifier la matière. Le nom est peut-être déjà
              utilisé.
            </p>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        type="warning"
        title="Supprimer la matière"
        description={`Êtes-vous sûr de vouloir supprimer "${deleteTarget?.name}" ? Cette action est irréversible.`}
        size="sm"
        actions={{
          primary: {
            label: deleteSubject.isPending ? "Suppression…" : "Supprimer",
            onClick: handleDelete,
            variant: "destructive",
            disabled: deleteSubject.isPending,
            loading: deleteSubject.isPending,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setDeleteTarget(null),
            variant: "outline",
          },
        }}
      >
        <p className="text-sm text-muted-foreground">
          Les sessions, leçons et enregistrements de performance liés à cette
          matière ne seront pas supprimés, mais ils ne seront plus associés à
          une matière existante.
        </p>
      </Modal>
    </div>
  );
}
