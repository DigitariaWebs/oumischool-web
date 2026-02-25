"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PaymentStatusBadge, StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useActivateParent,
  useDeactivateParent,
  useParentDetail,
  useParentOrders,
  useSuspendParent,
} from "@/hooks/parents";
import type { AdminOrder } from "@/hooks/parents/api";
import { adaptParent, getPlanMeta, getParentInitials } from "@/lib/parents";
import { formatCurrency } from "@/lib/utils";
import type { Parent } from "@/types";
import {
  ArrowLeft,
  Baby,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Layers,
  Mail,
  Phone,
  ShieldCheck,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";

const PARENT_COLOR = "oklch(0.52 0.14 250)";

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function ParentOverviewTab({ parent }: { parent: Parent }) {
  const plan = getPlanMeta(parent.planId);

  return (
    <div className="space-y-6">
      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Enfants",
            value: parent.children.length,
            sub:
              parent.children.length === 0
                ? "Aucun enfant"
                : `${parent.children.length} inscrit${parent.children.length > 1 ? "s" : ""}`,
            icon: Baby,
            color: PARENT_COLOR,
            bg: "oklch(0.93 0.02 250)",
          },
          {
            label: "Total payé",
            value: parent.totalPayments
              ? formatCurrency(parent.totalPayments)
              : "—",
            sub: "depuis l'inscription",
            icon: CreditCard,
            color: "oklch(0.58 0.16 155)",
            bg: "oklch(0.95 0.018 155)",
          },
          {
            label: "Frais mensuels",
            value: parent.monthlyFee ? formatCurrency(parent.monthlyFee) : "—",
            sub: parent.monthlyFee ? "/mois" : "Aucun",
            icon: Layers,
            color: "oklch(0.62 0.16 80)",
            bg: "oklch(0.95 0.03 80)",
          },
          {
            label: "Statut",
            value:
              parent.status === "active"
                ? "Actif"
                : parent.status === "suspended"
                  ? "Suspendu"
                  : "Inactif",
            sub:
              parent.paymentStatus === "paid"
                ? "Paiement à jour"
                : parent.paymentStatus === "pending"
                  ? "En attente"
                  : "En retard",
            icon: parent.status === "active" ? CheckCircle2 : Clock,
            color:
              parent.status === "active"
                ? "oklch(0.58 0.16 155)"
                : "oklch(0.62 0.16 80)",
            bg:
              parent.status === "active"
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

      {/* Account info */}
      <div className="dash-card p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          Informations du compte
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Membre depuis", value: parent.joinedDate },
            { label: "ID parent", value: parent.id.toUpperCase().slice(0, 8) },
            { label: "Plan", value: plan ? plan.name : "—" },
            {
              label: "Statut",
              value:
                parent.status === "active"
                  ? "Actif"
                  : parent.status === "suspended"
                    ? "Suspendu"
                    : "Inactif",
            },
          ].map((item, index) => (
            <div key={`${item.label}-${index}`}>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                {item.label}
              </p>
              <p className="text-sm font-medium text-foreground mt-0.5">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {parent.notes && (
        <div className="dash-card p-5">
          <h2 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
            <Star className="h-4 w-4 text-muted-foreground" />
            Notes
          </h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {parent.notes}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Children Tab ─────────────────────────────────────────────────────────────

function ParentChildrenTab({ parent }: { parent: Parent }) {
  return (
    <div className="dash-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Baby className="h-4 w-4" style={{ color: PARENT_COLOR }} />
          Enfants inscrits
        </h2>
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-medium"
          style={{
            background: `${PARENT_COLOR}15`,
            color: PARENT_COLOR,
          }}
        >
          {parent.children.length}
        </span>
      </div>

      {parent.children.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Baby className="h-10 w-10 text-muted-foreground/30 mb-4" />
          <p className="text-sm font-medium text-foreground">
            Aucun enfant inscrit
          </p>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs">
            Les enfants ajoutés à ce compte parent apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/40">
          {parent.children.map((child, index) => {
            const childInitials = getParentInitials(child.name);
            const childContent = (
              <>
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: PARENT_COLOR }}
                >
                  {childInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {child.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {child.grade} · {child.age} ans
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
              </>
            );
            if (child.studentId) {
              return (
                <Link
                  key={`${child.name}-${index}`}
                  href={`/dashboard/students/${child.studentId}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  {childContent}
                </Link>
              );
            }
            return (
              <div
                key={`${child.name}-${index}`}
                className="flex items-center gap-4 px-5 py-4"
              >
                {childContent}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Payments Tab ────────────────────────────────────────────────────────────

function ParentPaymentsTab({
  parent,
  orders,
}: {
  parent: Parent;
  orders: AdminOrder[];
}) {
  const statusColors: Record<string, { bg: string; color: string }> = {
    PAID: { bg: "oklch(0.95 0.018 155)", color: "oklch(0.45 0.14 155)" },
    PENDING: { bg: "oklch(0.96 0.03 80)", color: "oklch(0.55 0.16 80)" },
    FAILED: { bg: "oklch(0.94 0.008 20)", color: "oklch(0.45 0.12 20)" },
    REFUNDED: { bg: "oklch(0.95 0.02 250)", color: "oklch(0.52 0.14 250)" },
    CANCELLED: { bg: "oklch(0.94 0.005 250)", color: "oklch(0.48 0.02 250)" },
  };

  const typeLabels: Record<string, string> = {
    RESOURCE: "Ressource",
    SESSION: "Séance",
    SUBSCRIPTION: "Abonnement",
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="dash-card p-5 flex flex-col gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: "oklch(0.95 0.018 155)" }}
          >
            <CreditCard
              className="h-4 w-4"
              style={{ color: "oklch(0.58 0.16 155)" }}
            />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(parent.totalPayments ?? 0)}
          </p>
          <p className="text-xs text-muted-foreground">Total payé</p>
        </div>
        <div className="dash-card p-5 flex flex-col gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: "oklch(0.95 0.03 80)" }}
          >
            <CalendarDays
              className="h-4 w-4"
              style={{ color: "oklch(0.62 0.16 80)" }}
            />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {parent.monthlyFee ? formatCurrency(parent.monthlyFee) : "—"}
          </p>
          <p className="text-xs text-muted-foreground">Frais mensuels</p>
        </div>
        <div className="dash-card p-5 flex flex-col gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{
              background:
                parent.paymentStatus === "paid"
                  ? "oklch(0.95 0.018 155)"
                  : parent.paymentStatus === "pending"
                    ? "oklch(0.96 0.03 80)"
                    : "oklch(0.96 0.025 20)",
            }}
          >
            {parent.paymentStatus === "paid" ? (
              <CheckCircle2
                className="h-4 w-4"
                style={{ color: "oklch(0.58 0.16 155)" }}
              />
            ) : parent.paymentStatus === "pending" ? (
              <Clock
                className="h-4 w-4"
                style={{ color: "oklch(0.62 0.16 80)" }}
              />
            ) : (
              <XCircle
                className="h-4 w-4"
                style={{ color: "oklch(0.62 0.16 80)" }}
              />
            )}
          </div>
          <p className="text-lg font-bold text-foreground capitalize">
            {parent.paymentStatus === "paid"
              ? "À jour"
              : parent.paymentStatus === "pending"
                ? "En attente"
                : "En retard"}
          </p>
          <p className="text-xs text-muted-foreground">Statut actuel</p>
        </div>
      </div>

      {/* Order history */}
      <div className="dash-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            Historique des commandes
          </h2>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CreditCard className="h-10 w-10 text-muted-foreground/30 mb-4" />
            <p className="text-sm font-medium text-foreground">
              Aucune commande
            </p>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs">
              L&apos;historique des paiements apparaîtra ici.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {orders.map((order) => {
              const style = statusColors[order.status] ?? statusColors.PENDING;
              return (
                <div
                  key={order.id}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: style.bg }}
                  >
                    <CreditCard
                      className="h-4 w-4"
                      style={{ color: style.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {typeLabels[order.type] || order.type}
                      </p>
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{ background: style.bg, color: style.color }}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {formatCurrency(order.amount / 100)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Plan Tab ─────────────────────────────────────────────────────────────────

function ParentPlanTab({ parent }: { parent: Parent }) {
  const plan = getPlanMeta(parent.planId);

  if (!plan) {
    return (
      <div className="dash-card overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShieldCheck className="h-10 w-10 text-muted-foreground/30 mb-4" />
          <p className="text-sm font-medium text-foreground">
            Aucun abonnement
          </p>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs">
            Ce parent n&apos;a pas encore souscrit à un plan.
          </p>
        </div>
      </div>
    );
  }

  const childCount = parent.children.length;
  const atLimit = plan.maxChildren !== null && childCount >= plan.maxChildren;

  return (
    <div className="space-y-6">
      {/* Plan hero */}
      <div className="dash-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: `${plan.color}18` }}
              >
                <ShieldCheck
                  className="h-5 w-5"
                  style={{ color: plan.color }}
                />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: plan.color }}>
                  {plan.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {plan.description}
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              {plan.price > 0 ? formatCurrency(plan.price) : "Sur mesure"}
            </p>
            {plan.price > 0 && (
              <p className="text-xs text-muted-foreground">/mois</p>
            )}
          </div>
        </div>
      </div>

      {/* Limits */}
      <div className="dash-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            Limites et accès
          </h2>
        </div>
        <div className="divide-y divide-border/40">
          {[
            {
              label: "Enfants",
              allowed:
                plan.maxChildren === null || childCount < plan.maxChildren,
              detail:
                plan.maxChildren === null
                  ? `${childCount} inscrits · Illimité`
                  : `${childCount} / ${plan.maxChildren} inscrits`,
              warning: atLimit,
              icon: Baby,
            },
            {
              label: "Accès aux ressources",
              allowed: plan.resourceAccess,
              detail: plan.resourceAccess ? "Inclus" : "Non inclus",
              warning: false,
              icon: CreditCard,
            },
            {
              label: "Support prioritaire",
              allowed: plan.prioritySupport,
              detail: plan.prioritySupport ? "Inclus" : "Non inclus",
              warning: false,
              icon: Star,
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={`${item.label}-${index}`}
                className="flex items-center gap-4 px-5 py-4"
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    background: item.allowed
                      ? "oklch(0.95 0.018 155)"
                      : "oklch(0.94 0.008 20)",
                  }}
                >
                  <Icon
                    className="h-4 w-4"
                    style={{
                      color: item.allowed
                        ? "oklch(0.58 0.16 155)"
                        : "oklch(0.48 0.12 20)",
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
                {item.allowed ? (
                  <CheckCircle2
                    className="h-4 w-4"
                    style={{ color: "oklch(0.58 0.16 155)" }}
                  />
                ) : (
                  <XCircle
                    className="h-4 w-4"
                    style={{ color: "oklch(0.62 0.16 80)" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current usage */}
      <div className="dash-card p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          Utilisation actuelle
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">
                Enfants inscrits
              </span>
              <span className="text-xs font-medium text-foreground">
                {childCount} / {plan.maxChildren ?? "∞"}
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: plan.maxChildren
                    ? `${Math.min((childCount / plan.maxChildren) * 100, 100)}%`
                    : "0%",
                  background: atLimit
                    ? "oklch(0.62 0.16 80)"
                    : "oklch(0.58 0.16 155)",
                }}
              />
            </div>
            {atLimit && (
              <p className="text-xs text-orange-600 mt-1.5 flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Limite atteinte - Ajoutez un plan supérieur pour plus
                d&apos;enfants
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ParentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: parentData, isLoading } = useParentDetail(id);
  const { data: ordersData = [] } = useParentOrders(id);
  const activateParent = useActivateParent();
  const deactivateParent = useDeactivateParent();
  const suspendParent = useSuspendParent();
  const [confirmAction, setConfirmAction] = useState<
    "suspend" | "activate" | "deactivate" | null
  >(null);

  if (!isLoading && !parentData) notFound();
  if (!parentData) {
    return <div className="p-8 text-sm text-muted-foreground">Chargement…</div>;
  }

  const currentParent = adaptParent(parentData);
  const plan = getPlanMeta(currentParent.planId);
  const initials = getParentInitials(currentParent.name);

  const handleActivate = async () => {
    await activateParent.mutateAsync(id).catch(() => {});
    setConfirmAction(null);
  };

  const handleDeactivate = async () => {
    await deactivateParent.mutateAsync(id).catch(() => {});
    setConfirmAction(null);
  };

  const handleSuspend = async () => {
    await suspendParent.mutateAsync(id).catch(() => {});
    setConfirmAction(null);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Compact header */}
      <header
        className="shrink-0 border-b border-border/60 bg-background"
        style={{
          background: `linear-gradient(135deg, ${PARENT_COLOR}0a 0%, transparent 60%)`,
        }}
      >
        {/* Breadcrumb row */}
        <div className="flex h-11 items-center justify-between border-b border-border/40 px-6">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/parents">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 rounded-lg px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Parents
              </Button>
            </Link>
            <span className="text-border/80 text-xs">/</span>
            <span className="text-xs font-medium text-foreground">
              {currentParent.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {currentParent.status === "active" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1.5 rounded-lg px-3 text-xs"
                  onClick={() => setConfirmAction("deactivate")}
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Désactiver
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1.5 rounded-lg px-3 text-xs text-orange-600 border-orange-200 hover:bg-orange-50"
                  onClick={() => setConfirmAction("suspend")}
                >
                  Suspendre
                </Button>
              </>
            )}
            {(currentParent.status === "inactive" ||
              currentParent.status === "suspended") && (
              <Button
                size="sm"
                className="h-7 gap-1.5 rounded-lg px-3 text-xs text-white"
                style={{ background: "oklch(0.58 0.16 155)" }}
                onClick={() => setConfirmAction("activate")}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Réactiver
              </Button>
            )}
          </div>
        </div>

        {/* Profile + stats row */}
        <div className="flex items-center gap-5 px-6 py-4">
          {/* Avatar */}
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white shadow-sm"
            style={{ background: PARENT_COLOR }}
          >
            {initials}
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-base font-bold text-foreground leading-none">
                {currentParent.name}
              </h1>
              <StatusBadge status={currentParent.status} />
              <PaymentStatusBadge status={currentParent.paymentStatus} />
              {plan && (
                <span
                  className="flex items-center gap-1 text-xs font-medium"
                  style={{ color: plan.color }}
                >
                  <ShieldCheck className="h-3 w-3" />
                  {plan.name}
                </span>
              )}
            </div>
            <div className="mt-1.5 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Mail className="h-3 w-3" />
                {currentParent.email}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                {currentParent.phone}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="h-3 w-3" />
                Membre depuis {currentParent.joinedDate}
              </span>
            </div>
          </div>

          {/* Stat pills */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/60 px-3 py-2">
              <Baby className="h-3.5 w-3.5" style={{ color: PARENT_COLOR }} />
              <span className="text-sm font-bold text-foreground">
                {currentParent.children.length}
              </span>
              <span className="text-xs text-muted-foreground">enfants</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/60 px-3 py-2">
              <CreditCard
                className="h-3.5 w-3.5"
                style={{ color: "oklch(0.58 0.16 155)" }}
              />
              <span className="text-sm font-bold text-foreground">
                {currentParent.totalPayments
                  ? formatCurrency(currentParent.totalPayments)
                  : "—"}
              </span>
              <span className="text-xs text-muted-foreground">total</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/60 px-3 py-2">
              <Layers
                className="h-3.5 w-3.5"
                style={{ color: "oklch(0.62 0.16 80)" }}
              />
              <span className="text-sm font-bold text-foreground">
                {currentParent.monthlyFee
                  ? formatCurrency(currentParent.monthlyFee)
                  : "—"}
              </span>
              <span className="text-xs text-muted-foreground">/mois</span>
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList
              variant="line"
              className="w-full justify-start border-b border-border/60 rounded-none pb-0 h-auto"
            >
              <TabsTrigger value="overview" className="gap-1.5 pb-3">
                <Users className="h-3.5 w-3.5" />
                Vue générale
              </TabsTrigger>
              <TabsTrigger value="children" className="gap-1.5 pb-3">
                <Baby className="h-3.5 w-3.5" />
                Enfants
                <span
                  className="rounded-full px-1.5 py-0 text-[10px] font-semibold"
                  style={{
                    background: `${PARENT_COLOR}15`,
                    color: PARENT_COLOR,
                  }}
                >
                  {currentParent.children.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="gap-1.5 pb-3">
                <CreditCard className="h-3.5 w-3.5" />
                Paiements
              </TabsTrigger>
              <TabsTrigger value="plan" className="gap-1.5 pb-3">
                <ShieldCheck className="h-3.5 w-3.5" />
                Plan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <ParentOverviewTab parent={currentParent} />
            </TabsContent>

            <TabsContent value="children">
              <ParentChildrenTab parent={currentParent} />
            </TabsContent>

            <TabsContent value="payments">
              <ParentPaymentsTab parent={currentParent} orders={ordersData} />
            </TabsContent>

            <TabsContent value="plan">
              <ParentPlanTab parent={currentParent} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Activate confirmation */}
      <Modal
        open={confirmAction === "activate"}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        type="confirmation"
        title="Réactiver le compte parent"
        description={`Êtes-vous sûr de vouloir réactiver le compte de ${currentParent.name} ? Il/elle retrouvera un accès complet à la plateforme.`}
        size="sm"
        actions={{
          primary: {
            label: "Oui, réactiver",
            onClick: handleActivate,
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
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: PARENT_COLOR }}
          >
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium">{currentParent.name}</p>
            <p className="text-xs text-muted-foreground">
              {currentParent.children.length} enfant
              {currentParent.children.length !== 1 ? "s" : ""} · Inscrit{" "}
              {currentParent.joinedDate}
            </p>
          </div>
        </div>
      </Modal>

      {/* Deactivate confirmation */}
      <Modal
        open={confirmAction === "deactivate"}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        type="warning"
        title="Désactiver le compte parent"
        description={`${currentParent.name} perdra l&apos;accès à la plateforme. Vous pouvez le/la réactiver à tout moment.`}
        size="sm"
        actions={{
          primary: {
            label: "Désactiver",
            onClick: handleDeactivate,
            variant: "destructive",
          },
          secondary: {
            label: "Annuler",
            onClick: () => setConfirmAction(null),
            variant: "outline",
          },
        }}
      >
        {currentParent.children.length > 0 && (
          <div
            className="flex items-start gap-2 rounded-xl border px-3 py-2.5 text-xs"
            style={{
              background: "oklch(0.96 0.025 20)",
              borderColor: "oklch(0.88 0.08 20)",
              color: "oklch(0.42 0.12 20)",
            }}
          >
            <Users className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              Ce parent a{" "}
              <strong>
                {currentParent.children.length} enfant
                {currentParent.children.length !== 1 ? "s" : ""} inscrits
              </strong>{" "}
              qui seront affectés.
            </span>
          </div>
        )}
      </Modal>

      {/* Suspend confirmation */}
      <Modal
        open={confirmAction === "suspend"}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        type="warning"
        title="Suspendre le compte parent"
        description={`Le compte de ${currentParent.name} sera suspendu. L&apos;accès à la plateforme sera bloqué jusqu&apos;à réactivation manuelle.`}
        size="sm"
        actions={{
          primary: {
            label: "Suspendre",
            onClick: handleSuspend,
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
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: PARENT_COLOR }}
          >
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium">{currentParent.name}</p>
            <p className="text-xs text-muted-foreground">
              {currentParent.children.length} enfant
              {currentParent.children.length !== 1 ? "s" : ""} · Inscrit{" "}
              {currentParent.joinedDate}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
