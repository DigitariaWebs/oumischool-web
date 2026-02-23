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
import { useCreateResourceUpload, useResources } from "@/hooks/resources";
import type { AdminResource } from "@/hooks/resources/api";
import { api } from "@/lib/api-client";
import { Resource, ResourceStatus, ResourceType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Plus,
  FileText,
  Video,
  Music,
  Image,
  File,
  Eye,
  Download,
  Tag,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

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
  if (normalized === "audio") return "audio";
  if (normalized === "image") return "image";
  if (normalized === "document") return "document";
  return "other";
}

function resolveApiResourceUrl(fileUrl: string | null | undefined): string {
  const raw = typeof fileUrl === "string" ? fileUrl.trim() : "";
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  const base = (
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
  ).replace(/\/+$/, "");
  return `${base}${raw.startsWith("/") ? "" : "/"}${raw}`;
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
    uploadedDate: new Date(resource.createdAt).toLocaleDateString("fr-FR", {
      month: "short",
      year: "numeric",
    }),
    fileSize: resource.fileSize ?? "—",
    tags: resource.tags,
  };
}

const typeIcons: Record<
  Resource["type"],
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  document: FileText,
  video: Video,
  audio: Music,
  image: Image,
  other: File,
};

const typeColors: Record<Resource["type"], { color: string; bg: string }> = {
  document: { color: "oklch(0.52 0.14 250)", bg: "oklch(0.93 0.02 250)" },
  video: { color: "oklch(0.58 0.16 155)", bg: "oklch(0.95 0.018 155)" },
  audio: { color: "oklch(0.68 0.18 20)", bg: "oklch(0.96 0.025 20)" },
  image: { color: "oklch(0.62 0.16 340)", bg: "oklch(0.96 0.02 340)" },
  other: { color: "oklch(0.52 0.02 250)", bg: "oklch(0.94 0.008 80)" },
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

const columns: ColumnDef<Resource>[] = [
  {
    key: "title",
    label: "Resource",
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
            <TypeIcon className="h-4 w-4" style={{ color: typeStyle.color }} />
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
    label: "Subject",
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
    label: "Status",
    sortable: true,
    render: (resource) => <StatusBadge status={resource.status} />,
  },
  {
    key: "actions",
    label: "File",
    sortable: false,
    render: (resource) => {
      const url = resolveApiResourceUrl(resource.fileUrl);
      if (!url) {
        return <span className="text-xs text-muted-foreground">No file</span>;
      }
      return (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open
        </a>
      );
    },
  },
  {
    key: "views",
    label: "Views",
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
    label: "Downloads",
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
    label: "Uploaded By",
    sortable: true,
    render: (resource) => (
      <span className="text-sm text-muted-foreground">
        {resource.uploadedBy}
      </span>
    ),
  },
  {
    key: "fileSize",
    label: "Size",
    sortable: false,
    render: (resource) => (
      <span className="text-sm text-muted-foreground">{resource.fileSize}</span>
    ),
  },
  {
    key: "uploadedDate",
    label: "Uploaded",
    sortable: true,
    render: (resource) => (
      <span className="text-sm text-muted-foreground">
        {resource.uploadedDate}
      </span>
    ),
  },
];

const filters = [
  {
    key: "status",
    label: "Status",
    options: [
      { label: "Published", value: "published" },
      { label: "Draft", value: "draft" },
      { label: "Archived", value: "archived" },
    ],
  },
  {
    key: "type",
    label: "Type",
    options: [
      { label: "Document", value: "document" },
      { label: "Video", value: "video" },
      { label: "Audio", value: "audio" },
      { label: "Image", value: "image" },
      { label: "Other", value: "other" },
    ],
  },
  {
    key: "subject",
    label: "Subject",
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
  tags: string;
} = {
  title: "",
  description: "",
  subject: "",
  type: "document",
  status: "draft",
  tags: "",
};

export default function ResourcesPage() {
  const { data: resourcesData = [], isLoading } = useResources();
  const createResourceUpload = useCreateResourceUpload();
  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => api.get<SubjectOption[]>("/subjects"),
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultFormState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const resources = resourcesData.map(adaptResource);

  const publishedCount = resources.filter(
    (r) => r.status === "published",
  ).length;
  const totalViews = resources.reduce((acc, r) => acc + r.views, 0);
  const totalDownloads = resources.reduce((acc, r) => acc + r.downloads, 0);

  const handleAdd = async () => {
    if (!form.title || !form.subject || !selectedFile) return;
    const payload = new FormData();
    payload.append("title", form.title);
    payload.append("subject", form.subject);
    payload.append("type", form.type);
    payload.append("status", form.status.toUpperCase());
    if (form.description) payload.append("description", form.description);
    if (form.tags) payload.append("tags", form.tags);
    payload.append("file", selectedFile);

    await createResourceUpload.mutateAsync(payload);
    setForm(defaultFormState);
    setSelectedFile(null);
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background px-6">
        <div>
          <h1 className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            Resources
          </h1>
          <p className="text-xs text-muted-foreground">
            {resources.length} resources &middot; {publishedCount} published
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 rounded-xl text-white"
          style={{ background: "oklch(0.60 0.18 20)" }}
          onClick={() => setModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Resource
        </Button>
      </header>

      {/* Summary bar */}
      <div className="flex items-center gap-4 border-b border-border/40 bg-background px-6 py-2.5">
        {[
          {
            icon: Eye,
            label: "Total views",
            value: totalViews.toLocaleString(),
            color: "oklch(0.52 0.14 250)",
          },
          {
            icon: Download,
            label: "Total downloads",
            value: totalDownloads.toLocaleString(),
            color: "oklch(0.58 0.16 155)",
          },
          {
            icon: FileText,
            label: "Drafts",
            value: resources.filter((r) => r.status === "draft").length,
            color: "oklch(0.52 0.14 80)",
          },
          {
            icon: File,
            label: "Archived",
            value: resources.filter((r) => r.status === "archived").length,
            color: "oklch(0.48 0.02 250)",
          },
        ]
          .map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" style={{ color: stat.color }} />
                <span className="text-xs text-muted-foreground">
                  {stat.label}:{" "}
                  <strong className="text-foreground">{stat.value}</strong>
                </span>
              </div>
            );
          })
          .reduce<React.ReactNode[]>((acc, el, i, arr) => {
            acc.push(el);
            if (i < arr.length - 1) {
              acc.push(
                <div key={`sep-${i}`} className="h-3.5 w-px bg-border/60" />,
              );
            }
            return acc;
          }, [])}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Chargement des ressources…
          </div>
        ) : (
          <DataTable
            data={resources}
            columns={columns}
            filters={filters}
            searchKeys={["title", "description", "subject", "uploadedBy"]}
            itemsPerPage={8}
          />
        )}
      </div>

      {/* Add Resource Modal */}
      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        type="form"
        title="Add New Resource"
        description="Upload or register a new learning resource on the platform."
        size="md"
        actions={{
          primary: {
            label: "Add Resource",
            onClick: handleAdd,
          },
          secondary: {
            label: "Cancel",
            onClick: () => {
              setForm(defaultFormState);
              setSelectedFile(null);
              setModalOpen(false);
            },
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="res-title">Title</Label>
            <Input
              id="res-title"
              placeholder="e.g. Introduction to Graphic Design"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="res-file">Fichier</Label>
            <Input
              id="res-file"
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            />
            {selectedFile ? (
              <p className="text-xs text-muted-foreground">
                {selectedFile.name} ({Math.ceil(selectedFile.size / 1024)} KB)
              </p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="res-description">Description</Label>
            <Input
              id="res-description"
              placeholder="Brief description of this resource"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Select
                value={form.subject}
                onValueChange={(v) => setForm((f) => ({ ...f, subject: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
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
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, type: v as Resource["type"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, status: v as Resource["status"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="res-tags">Tags</Label>
              <Input
                id="res-tags"
                placeholder="comma-separated: tag1, tag2"
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
              />
            </div>
          </div>
          {createResourceUpload.isError && (
            <p className="text-xs text-destructive">
              Impossible d&apos;uploader la ressource.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
