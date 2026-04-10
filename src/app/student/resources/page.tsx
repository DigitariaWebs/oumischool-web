"use client";

import {
  StudentEmptyCard,
  StudentErrorCard,
  StudentLoadingCard,
  StudentPageHeader,
} from "../_components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
  useStudentDownloadResource,
  useStudentRecordResourceView,
  useStudentResources,
} from "@/hooks/student";
import { useMemo, useState } from "react";

export default function StudentResourcesPage() {
  const resourcesQuery = useStudentResources();
  const recordView = useStudentRecordResourceView();
  const downloadResource = useStudentDownloadResource();

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

  const openInViewer = async () => {
    if (!selected) return;
    if (selected.type === "interactive" && selected.fileUrl) {
      window.open(selected.fileUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (selected.type === "document") {
      window.open(
        `/dashboard/resources/${selected.id}`,
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }

    if (
      (selected.type === "video" ||
        selected.type === "audio" ||
        selected.type === "image") &&
      selected.fileUrl
    ) {
      window.open(selected.fileUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const result = await downloadResource
      .mutateAsync(selected.id)
      .catch(() => null);
    if (result?.url) {
      window.open(result.url, "_blank", "noopener,noreferrer");
      return;
    }

    if (selected.fileUrl) {
      window.open(selected.fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="flex min-h-full flex-col">
      <StudentPageHeader
        title="Bibliothèque"
        subtitle="Tes ressources disponibles"
      />

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
          <StudentEmptyCard
            title="Aucune ressource"
            description="Aucune ressource ne correspond à tes filtres."
          />
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((resource) => (
            <Card
              key={resource.id}
              className="rounded-2xl border-border/70 shadow-sm"
            >
              <CardHeader>
                <CardTitle className="text-base">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {resource.description ?? "Sans description"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {resource.subject ?? "Matière"} • {resource.type}
                </p>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {selected?.description ?? "Aucune description."}
          </p>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => void openInViewer()}
              aria-label="Ouvrir la ressource dans le lecteur"
            >
              Ouvrir dans le lecteur
            </Button>
            <Button variant="outline" onClick={() => setOpenId(null)}>
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
