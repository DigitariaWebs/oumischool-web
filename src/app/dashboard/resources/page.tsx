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
import { Resource, ResourceStatus, ResourceType } from "@/types";
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
} from "lucide-react";
import { useState } from "react";

const mockResources: Resource[] = [
  {
    id: "r1",
    title: "Introduction to Graphic Design",
    description: "Foundational principles of graphic design for beginners.",
    type: "document",
    subject: "Graphic Design",
    status: "published",
    views: 1240,
    downloads: 388,
    uploadedBy: "Nina Roussel",
    uploadedDate: "Jan 2024",
    fileSize: "4.2 MB",
    tags: ["beginner", "design", "theory"],
  },
  {
    id: "r2",
    title: "Typography Fundamentals",
    description:
      "Everything you need to know about fonts, kerning, and layout.",
    type: "document",
    subject: "Typography",
    status: "published",
    views: 980,
    downloads: 275,
    uploadedBy: "Karim Zerrouk",
    uploadedDate: "Feb 2024",
    fileSize: "2.8 MB",
    tags: ["fonts", "layout", "intermediate"],
  },
  {
    id: "r3",
    title: "Color Theory — Principles & Elements",
    description: "Understanding color wheels, harmony, and contrast.",
    type: "document",
    subject: "Colors & Elements",
    status: "published",
    views: 1540,
    downloads: 490,
    uploadedBy: "Leila Mansouri",
    uploadedDate: "Jan 2024",
    fileSize: "6.1 MB",
    tags: ["colors", "theory", "beginner"],
  },
  {
    id: "r4",
    title: "UI/UX Design Crash Course",
    description: "Hands-on walkthrough of user interface design concepts.",
    type: "video",
    subject: "UI/UX Design",
    status: "published",
    views: 3200,
    downloads: 820,
    uploadedBy: "Sara Benali",
    uploadedDate: "Mar 2024",
    fileSize: "1.2 GB",
    tags: ["ui", "ux", "video", "intermediate"],
  },
  {
    id: "r5",
    title: "Basic 3D Modeling Techniques",
    description: "An audio lecture series on beginner 3D modeling.",
    type: "audio",
    subject: "3D Objects",
    status: "published",
    views: 640,
    downloads: 120,
    uploadedBy: "Yacine Boudali",
    uploadedDate: "Apr 2024",
    fileSize: "88 MB",
    tags: ["3d", "audio", "lecture"],
  },
  {
    id: "r6",
    title: "Physics — Motion & Forces",
    description: "Chapter 3 notes covering Newton&apos;s laws and kinematics.",
    type: "document",
    subject: "Physics",
    status: "published",
    views: 760,
    downloads: 310,
    uploadedBy: "Aalvina Fatehi",
    uploadedDate: "Nov 2023",
    fileSize: "1.4 MB",
    tags: ["physics", "notes", "grade-8"],
  },
  {
    id: "r7",
    title: "Advanced Algebra Workbook",
    description: "Practice problems and solutions for Grade 9 algebra.",
    type: "document",
    subject: "Mathematics",
    status: "draft",
    views: 0,
    downloads: 0,
    uploadedBy: "Omar Hadj",
    uploadedDate: "May 2025",
    fileSize: "3.0 MB",
    tags: ["algebra", "practice", "grade-9"],
  },
  {
    id: "r8",
    title: "Design Asset Pack — Icons & Illustrations",
    description:
      "A curated set of icons and illustrations for design students.",
    type: "image",
    subject: "Graphic Design",
    status: "published",
    views: 2100,
    downloads: 950,
    uploadedBy: "Sara Benali",
    uploadedDate: "Feb 2024",
    fileSize: "45 MB",
    tags: ["assets", "icons", "illustrations"],
  },
  {
    id: "r9",
    title: "History of Physics — Lecture Slides",
    description: "Slide deck covering major historical milestones in physics.",
    type: "document",
    subject: "Physics",
    status: "archived",
    views: 420,
    downloads: 90,
    uploadedBy: "Aalvina Fatehi",
    uploadedDate: "Sep 2023",
    fileSize: "8.5 MB",
    tags: ["history", "slides", "lecture"],
  },
  {
    id: "r10",
    title: "Geometry — Shapes & Theorems",
    description: "Comprehensive guide to geometric shapes, angles, and proofs.",
    type: "document",
    subject: "Mathematics",
    status: "published",
    views: 880,
    downloads: 230,
    uploadedBy: "Mariam Khoury",
    uploadedDate: "Dec 2023",
    fileSize: "2.2 MB",
    tags: ["geometry", "grade-6", "proofs"],
  },
];

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
            <p className="text-sm font-medium text-foreground truncate max-w-[220px]">
              {resource.title}
            </p>
            <p className="text-[11px] text-muted-foreground truncate max-w-[220px]">
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
  fileSize: string;
  uploadedBy: string;
  tags: string;
} = {
  title: "",
  description: "",
  subject: "",
  type: "document",
  status: "draft",
  fileSize: "",
  uploadedBy: "",
  tags: "",
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultFormState);

  const publishedCount = resources.filter(
    (r) => r.status === "published",
  ).length;
  const totalViews = resources.reduce((acc, r) => acc + r.views, 0);
  const totalDownloads = resources.reduce((acc, r) => acc + r.downloads, 0);

  const handleAdd = () => {
    if (!form.title || !form.subject) return;
    const newResource: Resource = {
      id: `r${Date.now()}`,
      title: form.title,
      description: form.description,
      type: form.type,
      subject: form.subject,
      status: form.status,
      views: 0,
      downloads: 0,
      uploadedBy: form.uploadedBy || "Admin",
      uploadedDate: new Date().toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      }),
      fileSize: form.fileSize || "—",
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };
    setResources((prev) => [newResource, ...prev]);
    setForm(defaultFormState);
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
        <DataTable
          data={resources}
          columns={columns}
          filters={filters}
          searchKeys={["title", "description", "subject", "uploadedBy"]}
          itemsPerPage={8}
        />
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
                  {[
                    "Physics",
                    "Mathematics",
                    "UI/UX Design",
                    "Graphic Design",
                    "Typography",
                    "3D Objects",
                    "Colors & Elements",
                  ].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
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
              <Label htmlFor="res-filesize">File Size</Label>
              <Input
                id="res-filesize"
                placeholder="e.g. 4.2 MB"
                value={form.fileSize}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fileSize: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="res-uploaded-by">Uploaded By</Label>
              <Input
                id="res-uploaded-by"
                placeholder="Tutor name"
                value={form.uploadedBy}
                onChange={(e) =>
                  setForm((f) => ({ ...f, uploadedBy: e.target.value }))
                }
              />
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
        </div>
      </Modal>
    </div>
  );
}
