"use client";

import { ResourceViewer } from "../_components/ResourceViewer";
import {
  StudentEmptyCard,
  StudentErrorCard,
  StudentLoadingCard,
  StudentPageHeader,
} from "../_components/common";
import { EmptyLessonsIllustration } from "../_components/illustrations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useStudentRecordResourceView,
  useStudentResources,
} from "@/hooks/student";
import { getResourceTypeLabel } from "@/lib/student-utils";
import { useMemo, useState } from "react";

export default function StudentResourcesPage() {
  const resourcesQuery = useStudentResources();
  const recordView = useStudentRecordResourceView();

  const [grade, setGrade] = useState("all");
  const [subject, setSubject] = useState("all");
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const entitled = useMemo(
    () =>
      (resourcesQuery.data ?? []).filter(
        (resource) => resource.hasEntitlement && !resource.isGame,
      ),
    [resourcesQuery.data],
  );

  const subjects = Array.from(
    new Set(entitled.map((r) => r.subject).filter(Boolean)),
  ) as string[];
  const grades = Array.from(
    new Set(entitled.map((r) => r.grade).filter(Boolean)),
  ) as string[];
  const types = Array.from(
    new Set(entitled.map((r) => r.type).filter(Boolean)),
  );

  const filtered = entitled.filter((resource) => {
    if (grade !== "all" && resource.grade !== grade) return false;
    if (subject !== "all" && resource.subject !== subject) return false;
    if (type !== "all" && resource.type !== type) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (
        !resource.title.toLowerCase().includes(q) &&
        !String(resource.description ?? "")
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const selected = filtered.find((resource) => resource.id === openId) ?? null;

  const openResource = async (resourceId: string) => {
    setOpenId(resourceId);
    await recordView.mutateAsync(resourceId).catch(() => undefined);
  };

  return (
    <div className="flex min-h-full flex-col">
      <StudentPageHeader
        title="Bibliothèque"
        subtitle="Tes ressources disponibles"
      />

      {/* Header with Illustration */}
      <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent px-3 py-6 md:px-6 md:py-8">
        <div className="grid items-center gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Accède à tes ressources
            </h2>
            <p className="mt-3 text-base text-gray-700">
              Consulte tous tes documents, vidéos et fichiers en un seul
              endroit.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Notebook-amico.svg"
              alt="Ressources"
              className="h-48 w-48 object-contain"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 p-3 md:p-6">
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardContent className="grid gap-3 py-4 md:grid-cols-5">
            <Input
              placeholder="Recherche"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Rechercher une ressource"
            />
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger aria-label="Filtrer par niveau">
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                {grades.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger aria-label="Filtrer par matière">
                <SelectValue placeholder="Matière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les matières</SelectItem>
                {subjects.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger aria-label="Filtrer par type">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {types.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setGrade("all");
                setSubject("all");
                setType("all");
                setSearch("");
              }}
            >
              Réinitialiser
            </Button>
          </CardContent>
        </Card>

        {resourcesQuery.isLoading ? (
          <StudentLoadingCard label="Chargement des ressources..." />
        ) : null}
        {resourcesQuery.isError ? (
          <StudentErrorCard
            message="Impossible de charger les ressources."
            onRetry={() => void resourcesQuery.refetch()}
          />
        ) : null}
        {!resourcesQuery.isLoading &&
        !resourcesQuery.isError &&
        filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Mental health-cuate.svg"
              alt="Aucune ressource"
              className="mb-6 h-48 w-48 object-contain"
            />
            <h3 className="text-lg font-semibold text-gray-800">
              Aucune ressource trouvée
            </h3>
            <p className="mt-2 max-w-xs text-sm text-gray-600">
              Essaie de modifier tes filtres ou reviens plus tard
            </p>
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((resource) => (
            <Card
              key={resource.id}
              className="rounded-2xl border-border/70 shadow-sm"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base">{resource.title}</CardTitle>
                  <Badge variant="secondary" className="shrink-0">
                    {getResourceTypeLabel(resource.type)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {resource.description ?? "Sans description"}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{resource.subject ?? "Matière"}</span>
                  <span>•</span>
                  <span>{resource.grade ?? "Tous niveaux"}</span>
                </div>
                <Button
                  className="h-10"
                  onClick={() => void openResource(resource.id)}
                  aria-label={`Ouvrir ${resource.title}`}
                >
                  Ouvrir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog
        open={!!selected}
        onOpenChange={(open) => setOpenId(open ? openId : null)}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>
              {selected?.description ?? "Ressource pédagogique"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {selected ? getResourceTypeLabel(selected.type) : "Ressource"}
            </Badge>
            <Badge variant="outline">{selected?.subject ?? "Matière"}</Badge>
            <Badge variant="outline">{selected?.grade ?? "Tous niveaux"}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {selected?.description ?? "Aucune description."}
          </p>
          {selected && <ResourceViewer resource={selected} />}
          <Button variant="outline" onClick={() => setOpenId(null)}>
            Fermer
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
