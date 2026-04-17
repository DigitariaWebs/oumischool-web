"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  CreateLessonPayload,
  LessonMaterialInput,
} from "@/hooks/lessons/api";
import { useResources } from "@/hooks/resources";
import { useSubjects } from "@/hooks/subjects";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

const GRADES = [
  "CP",
  "CE1",
  "CE2",
  "CM1",
  "CM2",
  "6ème",
  "5ème",
  "4ème",
  "3ème",
];

export type LessonFormValue = CreateLessonPayload;

interface LessonFormProps {
  initial?: Partial<LessonFormValue>;
  submitLabel: string;
  isPending: boolean;
  onSubmit: (v: LessonFormValue) => void | Promise<void>;
  onCancel?: () => void;
}

export function LessonForm({
  initial,
  submitLabel,
  isPending,
  onSubmit,
  onCancel,
}: LessonFormProps) {
  const { data: subjects = [] } = useSubjects();
  const { data: resources = [], isLoading: loadingResources } = useResources();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [subjectId, setSubjectId] = useState(initial?.subjectId ?? "");
  const [grade, setGrade] = useState(initial?.grade ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [materials, setMaterials] = useState<LessonMaterialInput[]>(
    initial?.materials ?? [],
  );

  const isValid = title.trim().length > 0 && !!subjectId;

  const resourcesById = useMemo(() => {
    const m = new Map<string, (typeof resources)[number]>();
    for (const r of resources) m.set(r.id, r);
    return m;
  }, [resources]);

  function updateMaterial(idx: number, patch: Partial<LessonMaterialInput>) {
    setMaterials((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, ...patch } : m)),
    );
  }

  function removeMaterial(idx: number) {
    setMaterials((prev) => prev.filter((_, i) => i !== idx));
  }

  function addMaterial() {
    setMaterials((prev) => [...prev, { title: "" }]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid || isPending) return;
    await onSubmit({
      title: title.trim(),
      subjectId,
      grade: grade || undefined,
      description: description.trim() || undefined,
      materials: materials.filter((m) => m.title.trim().length > 0),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="lesson-title">Titre *</Label>
        <Input
          id="lesson-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex. Introduction aux fractions"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Matière *</Label>
          <Select value={subjectId} onValueChange={setSubjectId}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une matière" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Niveau</Label>
          <Select
            value={grade || "__none"}
            onValueChange={(v) => setGrade(v === "__none" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous niveaux" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">Tous niveaux</SelectItem>
              {GRADES.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lesson-description">Description</Label>
        <textarea
          id="lesson-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Objectifs, instructions, notes..."
          rows={3}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Contenu / ressources</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={addMaterial}
          >
            <Plus className="h-3.5 w-3.5" />
            Ajouter
          </Button>
        </div>

        {materials.length === 0 ? (
          <p className="text-xs italic text-muted-foreground">
            Aucun contenu. Ajoutez des titres ou liez des ressources.
          </p>
        ) : (
          <div className="space-y-2">
            {materials.map((m, idx) => {
              const linked = m.resourceId
                ? resourcesById.get(m.resourceId)
                : null;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-2 rounded-lg border border-border bg-card p-3"
                >
                  <div className="flex flex-1 flex-col gap-2">
                    <Input
                      value={m.title}
                      onChange={(e) =>
                        updateMaterial(idx, { title: e.target.value })
                      }
                      placeholder="Titre du contenu"
                    />
                    <Select
                      value={m.resourceId ?? "__none"}
                      onValueChange={(v) =>
                        updateMaterial(idx, {
                          resourceId: v === "__none" ? undefined : v,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            loadingResources
                              ? "Chargement..."
                              : "Lier une ressource (optionnel)"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">Aucune</SelectItem>
                        {resources.map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.title}
                            {r.isPaid ? " · payant" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {linked ? (
                      <p className="text-xs text-muted-foreground">
                        {linked.type} · {linked.subject}
                      </p>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 text-destructive hover:text-destructive"
                    onClick={() => removeMaterial(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-4">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        ) : null}
        <Button
          type="submit"
          disabled={!isValid || isPending}
          className="gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {submitLabel}
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
