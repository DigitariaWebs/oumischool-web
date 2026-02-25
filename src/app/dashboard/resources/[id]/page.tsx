"use client";

import { Button } from "@/components/ui/button";
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
import {
  useArchiveResource,
  useResourceDetail,
  useUpdateResourceStatus,
} from "@/hooks/resources";
import type { AdminResource } from "@/hooks/resources/api";
import { Resource, ResourceStatus, ResourceType } from "@/types";
import {
  Archive,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Eye,
  File,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  Loader2,
  Tag,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";

const RESOURCE_COLOR = "oklch(0.60 0.18 20)";

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
      month: "long",
      day: "numeric",
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
  audio: FileAudio,
  image: FileImage,
  other: File,
};

const typeColors: Record<Resource["type"], { color: string; bg: string }> = {
  document: { color: "oklch(0.52 0.14 250)", bg: "oklch(0.93 0.02 250)" },
  video: { color: "oklch(0.58 0.16 155)", bg: "oklch(0.95 0.018 155)" },
  audio: { color: "oklch(0.68 0.18 20)", bg: "oklch(0.96 0.025 20)" },
  image: { color: "oklch(0.62 0.16 340)", bg: "oklch(0.96 0.02 340)" },
  other: { color: "oklch(0.52 0.02 250)", bg: "oklch(0.94 0.008 80)" },
};

function FilePreview({ resource }: { resource: Resource }) {
  const url = resolveApiResourceUrl(resource.fileUrl);
  const TypeIcon = typeIcons[resource.type];
  const typeStyle = typeColors[resource.type];

  if (!url) {
    return (
      <div className="dash-card p-8 flex flex-col items-center justify-center text-center">
        <File className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="text-sm font-medium text-foreground">Aucun fichier</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Cette ressource n&apos;a pas de fichier attaché.
        </p>
      </div>
    );
  }

  if (resource.type === "image") {
    return (
      <div className="dash-card overflow-hidden">
        <div className="relative aspect-video bg-muted/30">
          <img
            src={url}
            alt={resource.title}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="p-4 flex items-center justify-between border-t border-border/60">
          <div className="flex items-center gap-2">
            <TypeIcon className="h-4 w-4" style={{ color: typeStyle.color }} />
            <span className="text-sm text-muted-foreground">
              {resource.fileSize}
            </span>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            Ouvrir en grand
          </a>
        </div>
      </div>
    );
  }

  if (resource.type === "video" || resource.type === "audio") {
    return (
      <div className="dash-card overflow-hidden">
        <div className="relative aspect-video bg-black/5 dark:bg-white/5 flex items-center justify-center">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-3 p-8 rounded-2xl transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: typeStyle.bg }}
            >
              <TypeIcon
                className="h-8 w-8"
                style={{ color: typeStyle.color }}
              />
            </div>
            <span className="text-sm font-medium text-foreground">
              {resource.type === "video" ? "Lire la vidéo" : "Lire l'audio"}
            </span>
          </a>
        </div>
        <div className="p-4 flex items-center justify-between border-t border-border/60">
          <div className="flex items-center gap-2">
            <TypeIcon className="h-4 w-4" style={{ color: typeStyle.color }} />
            <span className="text-sm text-muted-foreground">
              {resource.fileSize}
            </span>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            Télécharger
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-card p-6">
      <div className="flex items-center gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
          style={{ background: typeStyle.bg }}
        >
          <TypeIcon className="h-7 w-7" style={{ color: typeStyle.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {resource.title}
          </p>
          <p className="text-xs text-muted-foreground">{resource.fileSize}</p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          Ouvrir
        </a>
      </div>
    </div>
  );
}

function ResourceOverviewTab({ resource }: { resource: Resource }) {
  const TypeIcon = typeIcons[resource.type];
  const typeStyle = typeColors[resource.type];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Vues",
            value: resource.views.toLocaleString(),
            sub: "depuis la publication",
            icon: Eye,
            color: "oklch(0.52 0.14 250)",
            bg: "oklch(0.93 0.02 250)",
          },
          {
            label: "Téléchargements",
            value: resource.downloads.toLocaleString(),
            sub: "au total",
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
            sub: resource.isPaid ? "CAD" : "pour tous",
            icon: resource.isPaid ? FileText : CheckCircle2,
            color: resource.isPaid
              ? "oklch(0.45 0.14 155)"
              : "oklch(0.58 0.16 155)",
            bg: resource.isPaid
              ? "oklch(0.95 0.025 155)"
              : "oklch(0.95 0.018 155)",
          },
          {
            label: "Statut",
            value:
              resource.status === "published"
                ? "Publiée"
                : resource.status === "archived"
                  ? "Archivée"
                  : "Brouillon",
            sub:
              resource.status === "published"
                ? "Visible par tous"
                : resource.status === "archived"
                  ? "Masquée"
                  : "En préparation",
            icon: resource.status === "published" ? Eye : Clock,
            color:
              resource.status === "published"
                ? "oklch(0.58 0.16 155)"
                : "oklch(0.52 0.14 80)",
            bg:
              resource.status === "published"
                ? "oklch(0.95 0.018 155)"
                : "oklch(0.95 0.03 80)",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="dash-card p-4 flex flex-col gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl"
                style={{ background: stat.bg }}
              >
                <Icon className="h-4 w-4" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <p className="text-[11px] text-muted-foreground/70">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="dash-card p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
          <File className="h-4 w-4 text-muted-foreground" />
          Informations de la ressource
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Titre", value: resource.title },
            { label: "Type", value: resource.type },
            { label: "Matière", value: resource.subject },
            { label: "Taille", value: resource.fileSize },
            { label: "Statut", value: resource.status },
            {
              label: "Prix",
              value: resource.isPaid
                ? `${(resource.price ?? 0) / 100} CAD`
                : "Gratuit",
            },
            { label: "Ajouté par", value: resource.uploadedBy },
            { label: "Date d'ajout", value: resource.uploadedDate },
          ].map((item, index) => (
            <div key={`${item.label}-${index}`}>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                {item.label}
              </p>
              <p className="text-sm font-medium text-foreground mt-0.5 truncate">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {resource.description && (
        <div className="dash-card p-5">
          <h2 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Description
          </h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {resource.description}
          </p>
        </div>
      )}

      {resource.tags.length > 0 && (
        <div className="dash-card p-5">
          <h2 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {resource.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium"
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

function ResourceFileTab({ resource }: { resource: Resource }) {
  return (
    <div className="space-y-6">
      <FilePreview resource={resource} />

      <div className="dash-card p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
          <Download className="h-4 w-4 text-muted-foreground" />
          Statistiques du fichier
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
              Taille
            </p>
            <p className="text-sm font-medium text-foreground mt-0.5">
              {resource.fileSize}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
              Téléchargements
            </p>
            <p className="text-sm font-medium text-foreground mt-0.5">
              {resource.downloads.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
              Vues
            </p>
            <p className="text-sm font-medium text-foreground mt-0.5">
              {resource.views.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
              Format
            </p>
            <p className="text-sm font-medium text-foreground mt-0.5 capitalize">
              {resource.type}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourcePurchasesTab({ resource }: { resource: Resource }) {
  const purchases = [
    {
      id: "1",
      user: "john@example.com",
      date: "15 jan 2024",
      amount: "9.99 CAD",
      status: "paid",
    },
    {
      id: "2",
      user: "jane@example.com",
      date: "14 jan 2024",
      amount: "9.99 CAD",
      status: "paid",
    },
    {
      id: "3",
      user: "bob@example.com",
      date: "13 jan 2024",
      amount: "9.99 CAD",
      status: "refunded",
    },
  ];

  if (!resource.isPaid) {
    return (
      <div className="dash-card overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-10 w-10 text-muted-foreground/30 mb-4" />
          <p className="text-sm font-medium text-foreground">
            Ressource gratuite
          </p>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs">
            Cette ressource est gratuite, donc aucun achat n&apos;est requis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="dash-card p-5 flex flex-col gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: "oklch(0.95 0.018 155)" }}
          >
            <Download
              className="h-4 w-4"
              style={{ color: "oklch(0.58 0.16 155)" }}
            />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {purchases.length}
          </p>
          <p className="text-xs text-muted-foreground">Achats totaux</p>
        </div>
        <div className="dash-card p-5 flex flex-col gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: "oklch(0.95 0.025 155)" }}
          >
            <span
              className="text-lg font-bold"
              style={{ color: "oklch(0.45 0.14 155)" }}
            >
              $
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            ${(purchases.length * 9.99).toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">Revenus totaux</p>
        </div>
        <div className="dash-card p-5 flex flex-col gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: "oklch(0.95 0.02 250)" }}
          >
            <XCircle
              className="h-4 w-4"
              style={{ color: "oklch(0.52 0.14 250)" }}
            />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {purchases.filter((p) => p.status === "refunded").length}
          </p>
          <p className="text-xs text-muted-foreground">Remboursements</p>
        </div>
      </div>

      <div className="dash-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Download className="h-4 w-4 text-muted-foreground" />
            Historique des achats
          </h2>
        </div>

        {purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Download className="h-10 w-10 text-muted-foreground/30 mb-4" />
            <p className="text-sm font-medium text-foreground">Aucun achat</p>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs">
              L&apos;historique des achats apparaîtra ici.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center gap-4 px-5 py-4"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background:
                      purchase.status === "paid"
                        ? "oklch(0.95 0.018 155)"
                        : "oklch(0.95 0.02 250)",
                  }}
                >
                  {purchase.status === "paid" ? (
                    <CheckCircle2
                      className="h-4 w-4"
                      style={{ color: "oklch(0.58 0.16 155)" }}
                    />
                  ) : (
                    <XCircle
                      className="h-4 w-4"
                      style={{ color: "oklch(0.52 0.14 250)" }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {purchase.user}
                    </p>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        background:
                          purchase.status === "paid"
                            ? "oklch(0.95 0.018 155)"
                            : "oklch(0.95 0.02 250)",
                        color:
                          purchase.status === "paid"
                            ? "oklch(0.45 0.14 155)"
                            : "oklch(0.52 0.14 250)",
                      }}
                    >
                      {purchase.status === "paid" ? "Payé" : "Remboursé"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {purchase.date}
                  </p>
                </div>
                <p className="text-sm font-bold text-foreground">
                  {purchase.amount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResourceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: resourceData, isLoading } = useResourceDetail(id);
  const updateStatus = useUpdateResourceStatus();
  const archiveResource = useArchiveResource();
  const [confirmAction, setConfirmAction] = useState<
    "archive" | "delete" | null
  >(null);

  if (!isLoading && !resourceData) notFound();
  if (!resourceData) {
    return (
      <div className="p-8 text-sm text-muted-foreground flex items-center justify-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Chargement...
      </div>
    );
  }

  const resource = adaptResource(resourceData);
  const TypeIcon = typeIcons[resource.type];
  const typeStyle = typeColors[resource.type];

  const handleArchive = async () => {
    await archiveResource.mutateAsync(id).catch(() => {});
    setConfirmAction(null);
  };

  const handleStatusChange = async (newStatus: string) => {
    await updateStatus.mutateAsync({ id, status: newStatus }).catch(() => {});
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header
        className="shrink-0 border-b border-border/60 bg-background"
        style={{
          background: `linear-gradient(135deg, ${RESOURCE_COLOR}0a 0%, transparent 60%)`,
        }}
      >
        <div className="flex h-11 items-center justify-between border-b border-border/40 px-6">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/resources">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 rounded-lg px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Ressources
              </Button>
            </Link>
            <span className="text-border/80 text-xs">/</span>
            <span className="text-xs font-medium text-foreground">
              {resource.title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Select value={resource.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-7 w-32 text-xs gap-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">
                  <span className="flex items-center gap-2">
                    <Eye className="h-3 w-3" />
                    Publiée
                  </span>
                </SelectItem>
                <SelectItem value="draft">
                  <span className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    Brouillon
                  </span>
                </SelectItem>
                <SelectItem value="archived">
                  <span className="flex items-center gap-2">
                    <Archive className="h-3 w-3" />
                    Archivée
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            {resource.status !== "archived" && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1.5 rounded-lg px-3 text-xs"
                onClick={() => setConfirmAction("archive")}
              >
                <Archive className="h-3.5 w-3.5" />
                Archiver
              </Button>
            )}
            {resource.status === "archived" && (
              <Button
                size="sm"
                className="h-7 gap-1.5 rounded-lg px-3 text-xs text-white"
                style={{ background: "oklch(0.58 0.16 155)" }}
                onClick={() => handleStatusChange("published")}
              >
                <Eye className="h-3.5 w-3.5" />
                Désarchiver
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-5 px-6 py-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white shadow-sm"
            style={{ background: typeStyle.bg, color: typeStyle.color }}
          >
            <TypeIcon className="h-6 w-6" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-base font-bold text-foreground leading-none">
                {resource.title}
              </h1>
              <StatusBadge status={resource.status} />
            </div>
            <div className="mt-1.5 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <BookOpen className="h-3 w-3" />
                {resource.subject}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                {resource.uploadedBy}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="h-3 w-3" />
                {resource.uploadedDate}
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/60 px-3 py-2">
              <Eye className="h-3.5 w-3.5" style={{ color: typeStyle.color }} />
              <span className="text-sm font-bold text-foreground">
                {resource.views.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">vues</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/60 px-3 py-2">
              <Download
                className="h-3.5 w-3.5"
                style={{ color: "oklch(0.58 0.16 155)" }}
              />
              <span className="text-sm font-bold text-foreground">
                {resource.downloads.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">téléch.</span>
            </div>
            {resource.isPaid && (
              <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/60 px-3 py-2">
                <span
                  className="text-sm font-bold"
                  style={{ color: "oklch(0.45 0.14 155)" }}
                >
                  ${((resource.price ?? 0) / 100).toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground">CAD</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList
              variant="line"
              className="w-full justify-start border-b border-border/60 rounded-none pb-0 h-auto"
            >
              <TabsTrigger value="overview" className="gap-1.5 pb-3">
                <File className="h-3.5 w-3.5" />
                Vue générale
              </TabsTrigger>
              <TabsTrigger value="file" className="gap-1.5 pb-3">
                <FileText className="h-3.5 w-3.5" />
                Fichier
              </TabsTrigger>
              <TabsTrigger value="purchases" className="gap-1.5 pb-3">
                <Download className="h-3.5 w-3.5" />
                Achats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <ResourceOverviewTab resource={resource} />
            </TabsContent>

            <TabsContent value="file">
              <ResourceFileTab resource={resource} />
            </TabsContent>

            <TabsContent value="purchases">
              <ResourcePurchasesTab resource={resource} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Modal
        open={confirmAction === "archive"}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        type="warning"
        title="Archiver la ressource"
        description={`Êtes-vous sûr de vouloir archiver "${resource.title}" ? Elle ne sera plus visible par les utilisateurs.`}
        size="sm"
        actions={{
          primary: {
            label: "Archiver",
            onClick: handleArchive,
            variant: "destructive",
          },
          secondary: {
            label: "Annuler",
            onClick: () => setConfirmAction(null),
            variant: "outline",
          },
        }}
      >
        <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ background: typeStyle.bg }}
          >
            <TypeIcon className="h-5 w-5" style={{ color: typeStyle.color }} />
          </div>
          <div>
            <p className="text-sm font-medium">{resource.title}</p>
            <p className="text-xs text-muted-foreground">
              {resource.subject} · {resource.type}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
