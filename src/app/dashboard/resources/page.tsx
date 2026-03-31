"use client";

import { PdfPreview } from "./PdfPreview";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TagsInput } from "@/components/ui/tags-input";
import {
  useArchiveResource,
  useCreateResourceUpload,
  useGenerateViewToken,
  useResources,
  useUpdateResourceStatus,
} from "@/hooks/resources";
import type { AdminResource } from "@/hooks/resources/api";
import { api } from "@/lib/api-client";
import { Resource, ResourceStatus, ResourceType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  Archive,
  BookOpen,
  CheckCircle2,
  Shield,
  User2,
  Download,
  ExternalLink,
  Eye,
  FileText,
  HardDrive,
  FileVideo,
  Globe,
  Loader2,
  MoreHorizontal,
  Plus,
  Tag,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RESOURCE_COLOR = "oklch(0.60 0.18 20)";

interface SubjectOption {
  id: string;
  name: string;
}

function normalizeStatus(status: unknown): ResourceStatus {
  const normalized = String(status ?? "").toUpperCase();
  if (normalized === "PUBLISHED") return "published";
  if (normalized === "ARCHIVED") return "archived";
  return "draft";
}

function normalizeType(type: unknown): ResourceType {
  const normalized = String(type ?? "").toLowerCase();
  if (normalized === "video") return "video";
  if (normalized === "interactive") return "interactive";
  return "document";
}

function adaptResource(resource: AdminResource): Resource {
  return {
    id: resource.id,
    title: resource.title,
    description: resource.description ?? "",
    type: normalizeType(resource.type),
    subject: resource.subject,
    status: normalizeStatus(resource.status),
    fileUrl: resource.fileUrl,
    views: resource.views,
    downloads: resource.downloads,
    uploadedBy: resource.uploader?.email ?? "—",
    uploaderRole: resource.uploader?.role ?? "",
    uploadedDate: new Date(resource.createdAt).toLocaleDateString("fr-FR", {
      month: "short",
      year: "numeric",
    }),
    fileSize: resource.fileSize ?? "—",
    tags: resource.tags,
    isPaid: resource.isPaid ?? false,
    price: resource.price ?? null,
  };
}

const typeIcons: Record<
  Resource["type"],
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  document: FileText,
  video: FileVideo,
  interactive: Globe,
};

const typeColors: Record<Resource["type"], { color: string; bg: string }> = {
  document: { color: "oklch(0.52 0.14 250)", bg: "oklch(0.93 0.02 250)" },
  video: { color: "oklch(0.58 0.16 155)", bg: "oklch(0.95 0.018 155)" },
  interactive: { color: "oklch(0.55 0.15 195)", bg: "oklch(0.94 0.04 195)" },
};

const subjectColors: Record<string, string> = {
  Physics: "oklch(0.65 0.12 220)",
  "UI/UX Design": "oklch(0.58 0.16 155)",
  Mathematics: "oklch(0.72 0.14 80)",
  "Graphic Design": "oklch(0.68 0.18 20)",
  Typography: "oklch(0.52 0.14 250)",
  "Colors & Elements": "oklch(0.62 0.16 340)",
  "3D Objects": "oklch(0.60 0.13 180)",
};

function ResourceQuickView({ resource }: { resource: Resource }) {
  const TypeIcon = typeIcons[resource.type];
  const typeStyle = typeColors[resource.type];

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl"
          style={{ background: typeStyle.bg, color: typeStyle.color }}
        >
          <TypeIcon className="h-7 w-7" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-foreground">
              {resource.title}
            </h3>
            <StatusBadge status={resource.status} />
          </div>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize"
              style={{ background: typeStyle.bg, color: typeStyle.color }}
            >
              {resource.type}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-xs text-muted-foreground">
              {resource.subject}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Vues",
            value: resource.views.toLocaleString(),
            icon: Eye,
            color: "oklch(0.52 0.14 250)",
            bg: "oklch(0.93 0.02 250)",
          },
          {
            label: "Téléchargements",
            value: resource.downloads.toLocaleString(),
            icon: Download,
            color: "oklch(0.58 0.16 155)",
            bg: "oklch(0.95 0.018 155)",
          },
          {
            label: "Prix",
            value: resource.isPaid
              ? resource.price
                ? `$${(resource.price / 100).toFixed(2)}`
                : "Payant"
              : "Gratuit",
            icon: resource.isPaid ? FileText : CheckCircle2,
            color: resource.isPaid
              ? "oklch(0.45 0.14 155)"
              : "oklch(0.58 0.16 155)",
            bg: resource.isPaid
              ? "oklch(0.95 0.025 155)"
              : "oklch(0.95 0.018 155)",
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

      {resource.description && (
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
            Description
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed rounded-xl bg-muted/40 px-3 py-2.5">
            {resource.description}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: BookOpen, label: resource.subject },
          { icon: HardDrive, label: resource.fileSize },
          { icon: Tag, label: resource.uploadedBy },
          { icon: ExternalLink, label: resource.uploadedDate },
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

      {resource.tags.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
            Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {resource.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                style={{
                  background: "oklch(0.94 0.008 80)",
                  color: "oklch(0.48 0.02 250)",
                }}
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ResourceActions({
  resource,
  onView,
  onArchive,
  onUnarchive,
  onPreviewInteractive,
}: {
  resource: Resource;
  onView: (r: Resource) => void;
  onArchive?: (r: Resource) => void;
  onUnarchive?: (r: Resource) => void;
  onPreviewInteractive?: (r: Resource) => void;
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
          onClick={() => onView(resource)}
        >
          <Eye className="h-3.5 w-3.5" />
          Aperçu rapide
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-xs" asChild>
          <Link href={`/dashboard/resources/${resource.id}`}>
            <ExternalLink className="h-3.5 w-3.5" />
            Profil complet
          </Link>
        </DropdownMenuItem>
        {resource.type === "interactive" && onPreviewInteractive && (
          <DropdownMenuItem
            className="gap-2 text-xs"
            onClick={() => onPreviewInteractive(resource)}
          >
            <Globe className="h-3.5 w-3.5" />
            Voir
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        {resource.status === "archived" && onUnarchive && (
          <DropdownMenuItem
            className="gap-2 text-xs text-green-700 focus:text-green-700 focus:bg-green-50"
            onClick={() => onUnarchive(resource)}
          >
            <Archive className="h-3.5 w-3.5" />
            Désarchiver
          </DropdownMenuItem>
        )}
        {(resource.status === "published" || resource.status === "draft") &&
          onArchive && (
            <DropdownMenuItem
              className="gap-2 text-xs text-orange-600 focus:text-orange-600 focus:bg-orange-50"
              onClick={() => onArchive(resource)}
            >
              <Archive className="h-3.5 w-3.5" />
              Archiver
            </DropdownMenuItem>
          )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function buildColumns(
  onView: (r: Resource) => void,
  onArchive?: (r: Resource) => void,
  onUnarchive?: (r: Resource) => void,
  onPreviewInteractive?: (r: Resource) => void,
): ColumnDef<Resource>[] {
  return [
    {
      key: "title",
      label: "Ressource",
      sortable: true,
      render: (resource) => {
        const TypeIcon = typeIcons[resource.type];
        const typeStyle = typeColors[resource.type];
        return (
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{ background: typeStyle.bg }}
            >
              <TypeIcon
                className="h-4 w-4"
                style={{ color: typeStyle.color }}
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate max-w-55">
                {resource.title}
              </p>
              <p className="text-[11px] text-muted-foreground truncate max-w-55">
                {resource.description}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (resource) => {
        const style = typeColors[resource.type];
        return (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
            style={{ background: style.bg, color: style.color }}
          >
            {resource.type}
          </span>
        );
      },
    },
    {
      key: "subject",
      label: "Matière",
      sortable: true,
      render: (resource) => {
        const color = subjectColors[resource.subject] ?? "oklch(0.58 0.16 155)";
        return (
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" style={{ color }} />
            <span className="text-sm">{resource.subject}</span>
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (resource) => <StatusBadge status={resource.status} />,
    },
    {
      key: "isPaid",
      label: "Prix",
      sortable: false,
      render: (resource) =>
        resource.isPaid ? (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              background: "oklch(0.95 0.025 155)",
              color: "oklch(0.45 0.14 155)",
            }}
          >
            {resource.price
              ? `$${(resource.price / 100).toFixed(2)}`
              : "Payant"}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Gratuit</span>
        ),
    },
    {
      key: "views",
      label: "Vues",
      sortable: true,
      render: (resource) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Eye className="h-3.5 w-3.5" />
          {resource.views.toLocaleString()}
        </div>
      ),
    },
    {
      key: "downloads",
      label: "Télécharg.",
      sortable: true,
      render: (resource) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Download className="h-3.5 w-3.5" />
          {resource.downloads.toLocaleString()}
        </div>
      ),
    },
    {
      key: "tags",
      label: "Tags",
      sortable: false,
      render: (resource) => {
        const tags = resource.tags;
        return (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{
                  background: "oklch(0.94 0.008 80)",
                  color: "oklch(0.48 0.02 250)",
                }}
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="text-[10px] text-muted-foreground self-center">
                +{tags.length - 2}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "uploadedBy",
      label: "Ajouté par",
      sortable: false,
      render: (resource) => {
        const isPlatform = resource.uploaderRole === "ADMIN";
        if (isPlatform) {
          return (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{
                background: "oklch(0.93 0.025 280)",
                color: "oklch(0.48 0.18 280)",
              }}
            >
              <Shield className="h-3 w-3" />
              Plateforme
            </span>
          );
        }
        return (
          <div className="flex items-center gap-1.5">
            <User2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span
              className="max-w-36 truncate text-xs text-muted-foreground"
              title={resource.uploadedBy}
            >
              {resource.uploadedBy}
            </span>
          </div>
        );
      },
    },
    {
      key: "uploadedDate",
      label: "Date",
      sortable: true,
      render: (resource) => (
        <span className="text-sm text-muted-foreground">
          {resource.uploadedDate}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (resource) => (
        <ResourceActions
          resource={resource}
          onView={onView}
          onArchive={onArchive}
          onUnarchive={onUnarchive}
          onPreviewInteractive={onPreviewInteractive}
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
      { label: "Publiée", value: "published" },
      { label: "Brouillon", value: "draft" },
      { label: "Archivée", value: "archived" },
    ],
  },
  {
    key: "type",
    label: "Type",
    options: [
      { label: "Document", value: "document" },
      { label: "Vidéo", value: "video" },
      { label: "Interactive", value: "interactive" },
    ],
  },
  {
    key: "subject",
    label: "Matière",
    options: [
      { label: "Physics", value: "Physics" },
      { label: "Mathematics", value: "Mathematics" },
      { label: "UI/UX Design", value: "UI/UX Design" },
      { label: "Graphic Design", value: "Graphic Design" },
      { label: "Typography", value: "Typography" },
      { label: "3D Objects", value: "3D Objects" },
      { label: "Colors & Elements", value: "Colors & Elements" },
    ],
  },
];

const defaultFormState: {
  title: string;
  description: string;
  subject: string;
  type: ResourceType;
  status: ResourceStatus;
  tags: string[];
  isPaid: boolean;
  price: string;
} = {
  title: "",
  description: "",
  subject: "",
  type: "document",
  status: "draft",
  tags: [],
  isPaid: false,
  price: "",
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
        <BookOpen
          className="h-7 w-7"
          style={{ color: "oklch(0.58 0.16 155)" }}
        />
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export default function ResourcesPage() {
  const router = useRouter();
  const { data: resourcesData = [], isLoading } = useResources();
  const createResourceUpload = useCreateResourceUpload();
  const archiveResource = useArchiveResource();
  const updateResourceStatus = useUpdateResourceStatus();
  const generateViewToken = useGenerateViewToken();
  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => api.get<SubjectOption[]>("/subjects"),
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [viewResource, setViewResource] = useState<Resource | null>(null);
  const [form, setForm] = useState(defaultFormState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(
      file.type.startsWith("video/") || file.type === "application/pdf"
        ? URL.createObjectURL(file)
        : null,
    );
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const resources = resourcesData.map(adaptResource);

  const publishedResources = resources.filter((r) => r.status === "published");
  const draftResources = resources.filter((r) => r.status === "draft");
  const archivedResources = resources.filter((r) => r.status === "archived");

  const handleAdd = async () => {
    if (!form.title || !form.subject || !selectedFile) return;
    const payload = new FormData();
    payload.append("title", form.title);
    payload.append("subject", form.subject);
    payload.append("type", form.type);
    payload.append("status", form.status.toUpperCase());
    if (form.description) payload.append("description", form.description);
    if (form.tags.length > 0) payload.append("tags", JSON.stringify(form.tags));
    if (form.isPaid) {
      payload.append("isPaid", "true");
      if (form.price) {
        payload.append(
          "price",
          String(Math.round(parseFloat(form.price) * 100)),
        );
      }
    }
    payload.append("file", selectedFile);

    await createResourceUpload.mutateAsync(payload);
    setForm(defaultFormState);
    setSelectedFile(null);
    setModalOpen(false);
  };

  const handleArchive = async (resource: Resource) => {
    await archiveResource.mutateAsync(resource.id).catch(() => {});
  };

  const handleUnarchive = async (resource: Resource) => {
    await updateResourceStatus
      .mutateAsync({ id: resource.id, status: "published" })
      .catch(() => {});
  };

  const handlePreviewInteractive = async (resource: Resource) => {
    try {
      const { token } = await generateViewToken.mutateAsync(resource.id);
      const apiBase = (
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
      ).replace(/\/+$/, "");
      const url = `${apiBase}/resources/${resource.id}/view?token=${token}`;
      window.open(url, "_blank");
    } catch {
      // token generation failed — silent for now
    }
  };

  const columns = buildColumns(
    setViewResource,
    handleArchive,
    handleUnarchive,
    handlePreviewInteractive,
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background px-4 md:px-6">
        <div>
          <h1 className="flex items-center gap-2 text-base font-semibold text-foreground tracking-tight">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            Ressources
          </h1>
          <p className="text-xs text-muted-foreground">
            {resources.length} ressources · {publishedResources.length} publiées
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 rounded-xl text-white"
          style={{ background: RESOURCE_COLOR }}
          onClick={() => setModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Nouvelle ressource
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="all" className="h-full">
          <TabsList
            variant="line"
            className="w-full justify-start border-b border-border/60 rounded-none pb-0 h-auto bg-background px-6"
          >
            <TabsTrigger value="all" className="gap-1.5 pb-3">
              Toutes les ressources
              <span
                className="rounded-full px-1.5 py-0 text-[10px] font-semibold"
                style={{
                  background: "oklch(0.94 0.008 80)",
                  color: "oklch(0.48 0.02 250)",
                }}
              >
                {resources.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="published" className="gap-1.5 pb-3">
              Publiées
              <span
                className="rounded-full px-1.5 py-0 text-[10px] font-semibold"
                style={{
                  background: "oklch(0.95 0.018 155)",
                  color: "oklch(0.38 0.12 155)",
                }}
              >
                {publishedResources.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="draft" className="gap-1.5 pb-3">
              Brouillons
              <span
                className="rounded-full px-1.5 py-0 text-[10px] font-semibold"
                style={{
                  background: "oklch(0.95 0.03 80)",
                  color: "oklch(0.52 0.14 80)",
                }}
              >
                {draftResources.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="archived" className="gap-1.5 pb-3">
              Archivées
              {archivedResources.length > 0 && (
                <span
                  className="rounded-full px-1.5 py-0 text-[10px] font-semibold"
                  style={{
                    background: "oklch(0.94 0.008 80)",
                    color: "oklch(0.48 0.02 250)",
                  }}
                >
                  {archivedResources.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="p-4 md:p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : resources.length === 0 ? (
              <EmptyState
                title="Aucune ressource"
                description="Aucune ressource n'a encore été ajoutée."
              />
            ) : (
              <DataTable
                data={resources}
                columns={columns}
                filters={filters}
                searchKeys={["title", "description", "subject"]}
                itemsPerPage={8}
                onRowClick={setViewResource}
              />
            )}
          </TabsContent>

          <TabsContent value="published" className="p-4 md:p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : publishedResources.length === 0 ? (
              <EmptyState
                title="Aucune ressource publiée"
                description="Aucune ressource publiée pour le moment."
              />
            ) : (
              <DataTable
                data={publishedResources}
                columns={columns}
                filters={filters}
                searchKeys={["title", "description", "subject"]}
                itemsPerPage={8}
                onRowClick={setViewResource}
              />
            )}
          </TabsContent>

          <TabsContent value="draft" className="p-4 md:p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : draftResources.length === 0 ? (
              <EmptyState
                title="Aucun brouillon"
                description="Aucun brouillon pour le moment."
              />
            ) : (
              <DataTable
                data={draftResources}
                columns={columns}
                filters={filters}
                searchKeys={["title", "description", "subject"]}
                itemsPerPage={8}
                onRowClick={setViewResource}
              />
            )}
          </TabsContent>

          <TabsContent value="archived" className="p-4 md:p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : archivedResources.length === 0 ? (
              <EmptyState
                title="Aucune ressource archivée"
                description="Aucune ressource archivée pour le moment."
              />
            ) : (
              <DataTable
                data={archivedResources}
                columns={columns}
                filters={filters}
                searchKeys={["title", "description", "subject"]}
                itemsPerPage={8}
                onRowClick={setViewResource}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Modal
        open={!!viewResource}
        onOpenChange={(open) => !open && setViewResource(null)}
        type="details"
        title="Profil de la ressource"
        description="Aperçu rapide — ouvrez le profil complet pour tous les détails."
        size="md"
        icon={null}
        actions={{
          primary: viewResource
            ? {
                label: "Ouvrir le profil complet",
                onClick: () => {
                  router.push(`/dashboard/resources/${viewResource.id}`);
                },
                icon: <ExternalLink className="h-3.5 w-3.5" />,
              }
            : undefined,
          secondary: {
            label: "Fermer",
            onClick: () => setViewResource(null),
            variant: "outline",
          },
        }}
      >
        {viewResource && <ResourceQuickView resource={viewResource} />}
      </Modal>

      <Modal
        open={modalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setForm(defaultFormState);
            clearFile();
          }
          setModalOpen(open);
        }}
        type="form"
        title="Ajouter une nouvelle ressource"
        description="Téléchargez une nouvelle ressource d'apprentissage."
        size="lg"
        actions={{
          primary: {
            label: createResourceUpload.isPending
              ? "Ajout en cours..."
              : "Ajouter la ressource",
            onClick: handleAdd,
          },
          secondary: {
            label: "Annuler",
            onClick: () => {
              setForm(defaultFormState);
              clearFile();
              setModalOpen(false);
            },
            variant: "outline",
          },
        }}
      >
        <div className="space-y-5">
          {/* ── Type selector ── */}
          <div className="space-y-2">
            <Label>Type de ressource</Label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  {
                    type: "document" as const,
                    Icon: FileText,
                    label: "Document",
                    hint: "PDF, Word, Excel, PPT…",
                  },
                  {
                    type: "video" as const,
                    Icon: FileVideo,
                    label: "Vidéo",
                    hint: "MP4, WebM, MOV, AVI",
                  },
                  {
                    type: "interactive" as const,
                    Icon: Globe,
                    label: "Interactive",
                    hint: "Fichier HTML",
                  },
                ] as const
              ).map(({ type, Icon, label, hint }) => {
                const selected = form.type === type;
                const c = typeColors[type];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      if (form.type !== type) {
                        setForm((f) => ({ ...f, type }));
                        clearFile();
                      }
                    }}
                    className="flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all hover:border-current"
                    style={
                      selected
                        ? {
                            background: c.bg,
                            borderColor: c.color,
                            boxShadow: `0 0 0 1px ${c.color}`,
                          }
                        : {
                            background: "transparent",
                            borderColor: "hsl(var(--border))",
                          }
                    }
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{
                        background: selected
                          ? c.color + "28"
                          : "hsl(var(--muted))",
                      }}
                    >
                      <Icon
                        className="h-4 w-4"
                        style={{
                          color: selected
                            ? c.color
                            : "hsl(var(--muted-foreground))",
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-semibold"
                      style={{
                        color: selected ? c.color : "hsl(var(--foreground))",
                      }}
                    >
                      {label}
                    </span>
                    <span className="text-[10px] leading-tight text-muted-foreground">
                      {hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── File upload zone ── */}
          <div className="space-y-2">
            <Label>Fichier</Label>
            <div
              onDragEnter={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileSelect(file);
              }}
              onClick={() => document.getElementById("res-file-input")?.click()}
              className="relative flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors"
              style={{
                borderColor: dragOver
                  ? typeColors[form.type].color
                  : selectedFile
                    ? typeColors[form.type].color + "90"
                    : "hsl(var(--border))",
                background: dragOver
                  ? typeColors[form.type].bg
                  : selectedFile
                    ? typeColors[form.type].bg
                    : "hsl(var(--muted) / 0.3)",
              }}
            >
              <input
                id="res-file-input"
                type="file"
                className="sr-only"
                accept={
                  form.type === "document"
                    ? ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                    : form.type === "video"
                      ? ".mp4,.webm,.mov,.avi"
                      : ".html"
                }
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                  e.target.value = "";
                }}
              />

              {selectedFile ? (
                <div className="flex flex-col items-center gap-1 px-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className="h-4 w-4 shrink-0"
                      style={{ color: typeColors[form.type].color }}
                    />
                    <span className="max-w-60 truncate text-xs font-medium text-foreground">
                      {selectedFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile();
                      }}
                      className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              ) : (
                <>
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Glisser-déposer ou{" "}
                    <span
                      className="font-medium"
                      style={{ color: typeColors[form.type].color }}
                    >
                      cliquer pour choisir
                    </span>
                  </span>
                  <span className="text-[10px] text-muted-foreground/70">
                    {form.type === "document"
                      ? "PDF, DOC, DOCX, PPT, XLS, TXT · max 75 MB"
                      : form.type === "video"
                        ? "MP4, WebM, MOV, AVI · max 75 MB"
                        : "HTML uniquement · max 75 MB"}
                  </span>
                </>
              )}
            </div>

            {/* Video preview */}
            {previewUrl && form.type === "video" && (
              <div className="overflow-hidden rounded-xl border border-border/60 bg-black">
                <video
                  src={previewUrl}
                  controls
                  className="max-h-52 w-full object-contain"
                />
              </div>
            )}

            {/* PDF preview */}
            {previewUrl &&
              form.type === "document" &&
              selectedFile?.type === "application/pdf" && (
                <div className="overflow-hidden rounded-xl border border-border/60">
                  <div
                    className="flex items-center justify-between border-b border-border/60 px-3 py-2"
                    style={{ background: typeColors.document.bg }}
                  >
                    <span
                      className="text-[11px] font-medium"
                      style={{ color: typeColors.document.color }}
                    >
                      Aperçu PDF
                    </span>
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] transition-opacity hover:opacity-70"
                      style={{ color: typeColors.document.color }}
                    >
                      <ExternalLink className="h-3 w-3" />
                      Ouvrir
                    </a>
                  </div>
                  <PdfPreview url={previewUrl} />
                </div>
              )}
          </div>

          {/* ── Title ── */}
          <div className="space-y-1.5">
            <Label htmlFor="res-title">Titre</Label>
            <Input
              id="res-title"
              placeholder="ex. Introduction au Graphic Design"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>

          {/* ── Description ── */}
          <div className="space-y-1.5">
            <Label htmlFor="res-description">Description</Label>
            <Input
              id="res-description"
              placeholder="Brève description de cette ressource"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          {/* ── Subject + Status ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Matière</Label>
              <Select
                value={form.subject}
                onValueChange={(v) => setForm((f) => ({ ...f, subject: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une matière" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Statut</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, status: v as Resource["status"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Publiée</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ── Tags ── */}
          <div className="space-y-1.5">
            <Label>Tags</Label>
            <TagsInput
              value={form.tags}
              onChange={(tags) => setForm((f) => ({ ...f, tags }))}
            />
          </div>

          {/* ── Paid toggle ── */}
          <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5">
            <input
              id="res-ispaid"
              type="checkbox"
              checked={form.isPaid}
              onChange={(e) =>
                setForm((f) => ({ ...f, isPaid: e.target.checked }))
              }
              className="mt-0.5 h-4 w-4 cursor-pointer rounded border-border accent-primary"
            />
            <div>
              <Label
                htmlFor="res-ispaid"
                className="mb-0 cursor-pointer text-sm"
              >
                Ressource payante
              </Label>
              <p className="text-[10px] text-muted-foreground">
                Les étudiants devront acheter ou s&apos;abonner pour y accéder
              </p>
            </div>
          </div>

          {form.isPaid && (
            <div className="space-y-1.5">
              <Label htmlFor="res-price">Prix (CAD)</Label>
              <Input
                id="res-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="ex. 9.99"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
              />
            </div>
          )}

          {createResourceUpload.isError && (
            <p className="text-xs text-destructive">
              Impossible d&apos;ajouter la ressource. Vérifiez le fichier et
              réessayez.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
