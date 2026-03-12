"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { PdfViewer } from "@/components/ui/pdf-viewer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { TagsInput } from "@/components/ui/tags-input";
import {
  useResourceActivity,
  useResourceDetail,
  useUpdateResource,
  useUpdateResourceStatus,
} from "@/hooks/resources";
import type { AdminResource } from "@/hooks/resources/api";
import { api, getAuthToken } from "@/lib/api-client";
import { ResourceStatus } from "@/types";
import { Resource, ResourceType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  Archive,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CircleX,
  Clock,
  Download,
  ExternalLink,
  Eye,
  File,
  FileText,
  FileVideo,
  Globe,
  Library,
  Loader2,
  Pencil,
  Play,
  Shield,
  Tag,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";

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
  if (normalized === "interactive") return "interactive";
  if (normalized === "document") return "document";
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
  interactive: Globe,
};

const typeColors: Record<Resource["type"], { color: string; bg: string }> = {
  document: { color: "oklch(0.52 0.14 250)", bg: "oklch(0.93 0.02 250)" },
  video: { color: "oklch(0.58 0.16 155)", bg: "oklch(0.95 0.018 155)" },
  interactive: { color: "oklch(0.55 0.15 195)", bg: "oklch(0.94 0.04 195)" },
};

function useFileBlobUrl(url: string | null): {
  blobUrl: string | null;
  loading: boolean;
  error: boolean;
} {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;

    const token = getAuthToken();
    fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        const next = URL.createObjectURL(blob);
        objectUrlRef.current = next;
        setBlobUrl(next);
        setResolvedUrl(url);
        setError(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setResolvedUrl(url);
        }
      });

    return () => {
      cancelled = true;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setBlobUrl(null);
      setResolvedUrl(null);
      setError(false);
    };
  }, [url]);

  // loading = URL is set but hasn't resolved yet (no blob, no error)
  const loading = url !== null && resolvedUrl !== url && !error;

  return { blobUrl, loading, error };
}

function FilePreview({ resource }: { resource: Resource }) {
  const BASE = (
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
  ).replace(/\/+$/, "");
  const adminFileUrl = resource.fileUrl
    ? `${BASE}/admin/resources/${resource.id}/file`
    : null;

  const isPdf = /\.pdf$/i.test(resource.fileUrl ?? "");
  const needsBlob =
    (resource.type === "document" && isPdf) || resource.type === "video";

  const { blobUrl, loading, error } = useFileBlobUrl(
    needsBlob && adminFileUrl ? adminFileUrl : null,
  );

  const [downloadLoading, setDownloadLoading] = useState(false);

  const TypeIcon = typeIcons[resource.type];
  const typeStyle = typeColors[resource.type];

  const handleDownload = async () => {
    if (!adminFileUrl) return;
    if (blobUrl) {
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = resource.fileUrl?.split("/").pop() ?? resource.title;
      a.click();
      return;
    }
    setDownloadLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${adminFileUrl}?download=1`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = resource.fileUrl?.split("/").pop() ?? resource.title;
      a.click();
      URL.revokeObjectURL(objectUrl);
    } finally {
      setDownloadLoading(false);
    }
  };

  const DownloadBtn = () => (
    <button
      type="button"
      onClick={handleDownload}
      disabled={!adminFileUrl || downloadLoading}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
    >
      {downloadLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Download className="h-3.5 w-3.5" />
      )}
      Télécharger
    </button>
  );

  if (!adminFileUrl) {
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

  /* ── Loading state for fetched types ── */
  if (needsBlob && loading) {
    return (
      <div className="dash-card flex h-48 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Chargement du fichier…
          </span>
        </div>
      </div>
    );
  }

  /* ── PDF ── */
  if (resource.type === "document" && isPdf) {
    return (
      <div className="dash-card overflow-hidden">
        <div
          className="flex items-center justify-between border-b border-border/60 px-4 py-2.5"
          style={{ background: typeColors.document.bg }}
        >
          <span
            className="flex items-center gap-2 text-xs font-medium"
            style={{ color: typeColors.document.color }}
          >
            <FileText className="h-3.5 w-3.5" />
            Aperçu du document
            {resource.fileSize && resource.fileSize !== "—" && (
              <span className="font-normal opacity-70">
                · {resource.fileSize}
              </span>
            )}
          </span>
          <div className="flex items-center gap-2">
            {blobUrl && (
              <button
                type="button"
                onClick={() => window.open(blobUrl, "_blank")}
                className="flex items-center gap-1 text-xs transition-opacity hover:opacity-70"
                style={{ color: typeColors.document.color }}
              >
                <ExternalLink className="h-3 w-3" />
                Ouvrir
              </button>
            )}
            <DownloadBtn />
          </div>
        </div>
        {error ? (
          <div className="flex h-48 items-center justify-center">
            <span className="text-sm text-destructive">
              Impossible de charger le document.
            </span>
          </div>
        ) : blobUrl ? (
          <PdfViewer blobUrl={blobUrl} />
        ) : null}
      </div>
    );
  }

  /* ── Video ── */
  if (resource.type === "video") {
    return (
      <div className="dash-card overflow-hidden">
        {error ? (
          <div className="flex h-48 items-center justify-center">
            <span className="text-sm text-destructive">
              Impossible de charger la vidéo.
            </span>
          </div>
        ) : blobUrl ? (
          <video
            src={blobUrl}
            controls
            className="w-full bg-black"
            style={{ maxHeight: "70vh" }}
          />
        ) : null}
        <div className="flex items-center justify-between border-t border-border/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <TypeIcon className="h-4 w-4" style={{ color: typeStyle.color }} />
            <span className="text-sm text-muted-foreground">
              {resource.fileSize}
            </span>
          </div>
          <DownloadBtn />
        </div>
      </div>
    );
  }

  /* ── Non-PDF document / interactive fallback ── */
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
        <DownloadBtn />
      </div>
    </div>
  );
}

function ActivitySection({
  resourceId,
  isPaid,
}: {
  resourceId: string;
  isPaid: boolean;
}) {
  const { data: activity, isLoading } = useResourceActivity(resourceId);

  const totalRevenue =
    activity?.type === "orders"
      ? activity.entries.reduce(
          (s, e) => s + (e.status === "PAID" ? e.amount : 0),
          0,
        )
      : 0;
  const refunds =
    activity?.type === "orders"
      ? activity.entries.filter((e) => e.status === "REFUNDED").length
      : 0;

  return (
    <div className="space-y-4">
      {/* Summary cards — paid only */}
      {isPaid && (
        <div className="grid grid-cols-3 gap-4">
          <div className="dash-card p-4 flex flex-col gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ background: "oklch(0.95 0.018 155)" }}
            >
              <Users
                className="h-4 w-4"
                style={{ color: "oklch(0.58 0.16 155)" }}
              />
            </div>
            <p className="text-lg font-bold text-foreground">
              {isLoading ? "—" : (activity?.entries.length ?? 0)}
            </p>
            <p className="text-xs text-muted-foreground">Achats totaux</p>
          </div>
          <div className="dash-card p-4 flex flex-col gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ background: "oklch(0.95 0.025 155)" }}
            >
              <span
                className="text-sm font-bold"
                style={{ color: "oklch(0.45 0.14 155)" }}
              >
                $
              </span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {isLoading ? "—" : `$${(totalRevenue / 100).toFixed(2)}`}
            </p>
            <p className="text-xs text-muted-foreground">Revenus totaux</p>
          </div>
          <div className="dash-card p-4 flex flex-col gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ background: "oklch(0.95 0.02 250)" }}
            >
              <CircleX
                className="h-4 w-4"
                style={{ color: "oklch(0.52 0.14 250)" }}
              />
            </div>
            <p className="text-lg font-bold text-foreground">
              {isLoading ? "—" : refunds}
            </p>
            <p className="text-xs text-muted-foreground">Remboursements</p>
          </div>
        </div>
      )}

      {/* Log table */}
      <div className="dash-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border/60 px-5 py-3.5">
          {isPaid ? (
            <Download className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Library className="h-4 w-4 text-muted-foreground" />
          )}
          <h2 className="text-sm font-semibold text-foreground">
            {isPaid ? "Historique des achats" : "Bibliothèque — ajouts"}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : !activity || activity.entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            {isPaid ? (
              <Download className="h-9 w-9 text-muted-foreground/30 mb-3" />
            ) : (
              <Library className="h-9 w-9 text-muted-foreground/30 mb-3" />
            )}
            <p className="text-sm font-medium text-foreground">
              {isPaid ? "Aucun achat" : "Aucun ajout"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {isPaid
                ? "L'historique apparaîtra ici après le premier achat."
                : "Les ajouts à la bibliothèque apparaîtront ici."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {activity.entries.map((entry) => {
              const isOrder = activity.type === "orders";
              const order = isOrder
                ? (entry as (typeof activity.entries)[0] & {
                    amount: number;
                    status: string;
                  })
                : null;
              const isPaid_ = order?.status === "PAID";
              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-4 px-5 py-3.5"
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: isOrder
                        ? isPaid_
                          ? "oklch(0.95 0.018 155)"
                          : "oklch(0.95 0.02 250)"
                        : "oklch(0.93 0.025 280)",
                    }}
                  >
                    {isOrder ? (
                      isPaid_ ? (
                        <CheckCircle2
                          className="h-4 w-4"
                          style={{ color: "oklch(0.58 0.16 155)" }}
                        />
                      ) : (
                        <CircleX
                          className="h-4 w-4"
                          style={{ color: "oklch(0.52 0.14 250)" }}
                        />
                      )
                    ) : (
                      <Library
                        className="h-4 w-4"
                        style={{ color: "oklch(0.48 0.18 280)" }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground truncate max-w-xs">
                        {entry.email}
                      </p>
                      {isOrder && order && (
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                          style={{
                            background: isPaid_
                              ? "oklch(0.95 0.018 155)"
                              : "oklch(0.95 0.02 250)",
                            color: isPaid_
                              ? "oklch(0.45 0.14 155)"
                              : "oklch(0.52 0.14 250)",
                          }}
                        >
                          {isPaid_ ? "Payé" : "Remboursé"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(entry.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  {isOrder && order && (
                    <p className="text-sm font-bold text-foreground shrink-0">
                      ${(order.amount / 100).toFixed(2)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ResourceDetailBody({
  resource,
  onPreview,
}: {
  resource: Resource;
  onPreview: () => void;
}) {
  const TypeIcon = typeIcons[resource.type];
  const typeStyle = typeColors[resource.type];
  const canPreview =
    (resource.type === "document" && /\.pdf$/i.test(resource.fileUrl ?? "")) ||
    resource.type === "video";

  const BASE = (
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
  ).replace(/\/+$/, "");
  const adminFileUrl = resource.fileUrl
    ? `${BASE}/admin/resources/${resource.id}/file`
    : null;
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleDownload = async () => {
    if (!adminFileUrl) return;
    setDownloadLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${adminFileUrl}?download=1`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = resource.fileUrl?.split("/").pop() ?? resource.title;
      a.click();
      URL.revokeObjectURL(objectUrl);
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
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

      {/* File card */}
      <div className="dash-card p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
          <File className="h-4 w-4 text-muted-foreground" />
          Fichier
        </h2>
        <div className="flex items-center gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ background: typeStyle.bg }}
          >
            <TypeIcon className="h-6 w-6" style={{ color: typeStyle.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {resource.fileUrl?.split("/").pop() ?? resource.title}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {resource.type} · {resource.fileSize}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {canPreview && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 rounded-lg px-3 text-xs"
                onClick={onPreview}
              >
                <Play className="h-3.5 w-3.5" />
                Prévisualiser
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 rounded-lg px-3 text-xs"
              onClick={handleDownload}
              disabled={!adminFileUrl || downloadLoading}
            >
              {downloadLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              Télécharger
            </Button>
          </div>
        </div>
      </div>

      {/* Resource info */}
      <div className="dash-card p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
          <File className="h-4 w-4 text-muted-foreground" />
          Informations
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Type", value: resource.type },
            { label: "Matière", value: resource.subject },
            { label: "Taille", value: resource.fileSize },
            {
              label: "Prix",
              value: resource.isPaid
                ? `$${((resource.price ?? 0) / 100).toFixed(2)} CAD`
                : "Gratuit",
            },
            { label: "Ajouté par", value: resource.uploadedBy },
            { label: "Date d'ajout", value: resource.uploadedDate },
          ].map((item, i) => (
            <div key={i}>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                {item.label}
              </p>
              <p className="text-sm font-medium text-foreground mt-0.5 truncate capitalize">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
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

      {/* Tags */}
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

      {/* Activity */}
      <ActivitySection
        resourceId={resource.id}
        isPaid={resource.isPaid ?? false}
      />
    </div>
  );
}

interface SubjectOption {
  id: string;
  name: string;
}

interface EditForm {
  title: string;
  description: string;
  subject: string;
  tags: string[];
  isPaid: boolean;
  price: string;
}

export default function ResourceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: resourceData, isLoading } = useResourceDetail(id);
  const updateStatus = useUpdateResourceStatus();
  const updateResource = useUpdateResource();
  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => api.get<SubjectOption[]>("/subjects"),
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ResourceStatus | null>(
    null,
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    title: "",
    description: "",
    subject: "",
    tags: [],
    isPaid: false,
    price: "",
  });

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
  const isPlatformResource = resource.uploaderRole === "ADMIN";

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === resource.status) return;
    setConfirmAction(newStatus as ResourceStatus);
  };

  const handleConfirmStatusChange = async () => {
    if (!confirmAction) return;
    await updateStatus
      .mutateAsync({ id, status: confirmAction })
      .catch(() => {});
    setConfirmAction(null);
  };

  const openEditModal = () => {
    setEditForm({
      title: resource.title,
      description: resource.description,
      subject: resource.subject,
      tags: resource.tags,
      isPaid: resource.isPaid ?? false,
      price: resource.price ? String(resource.price / 100) : "",
    });
    setEditModalOpen(true);
  };

  const handleEdit = async () => {
    await updateResource.mutateAsync({
      id,
      body: {
        title: editForm.title,
        description: editForm.description,
        subject: editForm.subject,

        tags: editForm.tags,
        isPaid: editForm.isPaid,
        price:
          editForm.isPaid && editForm.price
            ? Math.round(parseFloat(editForm.price) * 100)
            : undefined,
      },
    });
    setEditModalOpen(false);
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
            {isPlatformResource && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1.5 rounded-lg px-3 text-xs"
                onClick={openEditModal}
              >
                <Pencil className="h-3.5 w-3.5" />
                Modifier
              </Button>
            )}
            <Select value={resource.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-7 w-36 text-xs gap-1.5">
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
              {isPlatformResource ? (
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    background: "oklch(0.93 0.025 280)",
                    color: "oklch(0.48 0.18 280)",
                  }}
                >
                  <Shield className="h-3 w-3" />
                  Plateforme
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  {resource.uploadedBy}
                </span>
              )}
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
        <div className="p-6">
          <ResourceDetailBody
            resource={resource}
            onPreview={() => setPreviewOpen(true)}
          />
        </div>
      </div>

      {/* ── Preview modal ── */}
      <Modal
        open={previewOpen}
        onOpenChange={(open) => !open && setPreviewOpen(false)}
        type="form"
        title={
          resource.type === "video" ? "Aperçu vidéo" : "Aperçu du document"
        }
        description={resource.title}
        size="lg"
        actions={{
          secondary: {
            label: "Fermer",
            onClick: () => setPreviewOpen(false),
            variant: "outline",
          },
        }}
      >
        <FilePreview resource={resource} />
      </Modal>

      <Modal
        open={confirmAction !== null}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        type={confirmAction === "archived" ? "warning" : "form"}
        title={
          confirmAction === "published"
            ? "Publier la ressource"
            : confirmAction === "draft"
              ? "Passer en brouillon"
              : "Archiver la ressource"
        }
        description={
          confirmAction === "published"
            ? `"${resource.title}" sera visible par tous les utilisateurs.`
            : confirmAction === "draft"
              ? `"${resource.title}" sera masquée et repassera en brouillon.`
              : `"${resource.title}" sera archivée et masquée des utilisateurs.`
        }
        size="sm"
        actions={{
          primary: {
            label: updateStatus.isPending
              ? "Enregistrement…"
              : confirmAction === "published"
                ? "Publier"
                : confirmAction === "draft"
                  ? "Mettre en brouillon"
                  : "Archiver",
            onClick: handleConfirmStatusChange,
            variant: confirmAction === "archived" ? "destructive" : "default",
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

      {/* ── Edit modal (platform resources only) ── */}
      <Modal
        open={editModalOpen}
        onOpenChange={(open) => {
          if (!open) setEditModalOpen(false);
        }}
        type="form"
        title="Modifier la ressource"
        description="Modifiez les informations de cette ressource de la plateforme."
        size="lg"
        actions={{
          primary: {
            label: updateResource.isPending ? "Enregistrement…" : "Enregistrer",
            onClick: handleEdit,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setEditModalOpen(false),
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-title">Titre</Label>
            <Input
              id="edit-title"
              value={editForm.title}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-description">Description</Label>
            <Input
              id="edit-description"
              value={editForm.description}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <Label>Matière</Label>
            <Select
              value={editForm.subject}
              onValueChange={(v) => setEditForm((f) => ({ ...f, subject: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une matière" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <Label>Tags</Label>
            <TagsInput
              value={editForm.tags}
              onChange={(tags) => setEditForm((f) => ({ ...f, tags }))}
            />
          </div>

          {/* Paid toggle */}
          <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5">
            <input
              id="edit-ispaid"
              type="checkbox"
              checked={editForm.isPaid}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, isPaid: e.target.checked }))
              }
              className="mt-0.5 h-4 w-4 cursor-pointer rounded border-border accent-primary"
            />
            <div>
              <Label
                htmlFor="edit-ispaid"
                className="mb-0 cursor-pointer text-sm"
              >
                Ressource payante
              </Label>
              <p className="text-[10px] text-muted-foreground">
                Les étudiants devront acheter ou s&apos;abonner pour y accéder
              </p>
            </div>
          </div>

          {editForm.isPaid && (
            <div className="space-y-1.5">
              <Label htmlFor="edit-price">Prix (CAD)</Label>
              <Input
                id="edit-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="ex. 9.99"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, price: e.target.value }))
                }
              />
            </div>
          )}

          {updateResource.isError && (
            <p className="text-xs text-destructive">
              Impossible d&apos;enregistrer les modifications. Réessayez.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
