"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PaymentStatusBadge, StatusBadge } from "@/components/ui/status-badge";
import {
  useActivateParent,
  useDeactivateParent,
  useParentDetail,
  useParentOrders,
  useSuspendParent,
} from "@/hooks/parents";
import type { AdminParent } from "@/hooks/parents/api";
import { useStudents } from "@/hooks/students";
import { formatCurrency } from "@/lib/utils";
import { Parent, PlanId } from "@/types";
import {
  ArrowLeft,
  Baby,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  StickyNote,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";

const PARENT_COLOR = "oklch(0.52 0.14 250)";

function getParentInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const PLAN_META: Record<
  PlanId,
  {
    name: string;
    color: string;
    price: number;
    description: string;
    maxChildren: number | null;
    resourceAccess: boolean;
    prioritySupport: boolean;
  }
> = {
  starter: {
    name: "Starter",
    color: "oklch(0.58 0.16 155)",
    price: 29,
    description: "Plan d'entrée pour un enfant.",
    maxChildren: 1,
    resourceAccess: true,
    prioritySupport: false,
  },
  family: {
    name: "Family",
    color: "oklch(0.62 0.16 80)",
    price: 59,
    description: "Plan famille avec plus de flexibilité.",
    maxChildren: 3,
    resourceAccess: true,
    prioritySupport: true,
  },
  premium: {
    name: "Premium",
    color: "oklch(0.52 0.14 250)",
    price: 89,
    description: "Plan avancé avec support prioritaire.",
    maxChildren: null,
    resourceAccess: true,
    prioritySupport: true,
  },
  custom: {
    name: "Custom",
    color: "oklch(0.68 0.18 20)",
    price: 0,
    description: "Plan personnalisé selon les besoins.",
    maxChildren: null,
    resourceAccess: true,
    prioritySupport: true,
  },
};

function getPlanMeta(planId?: PlanId) {
  return planId ? PLAN_META[planId] : undefined;
}

function adaptParent(parent: AdminParent): Parent {
  const normalizedStatus = String(parent.user?.status ?? "").toUpperCase();
  const status =
    normalizedStatus === "ACTIVE"
      ? "active"
      : normalizedStatus === "SUSPENDED"
        ? "suspended"
        : "inactive";
  const knownPlanId = parent.planId as PlanId | null;
  const isKnownPlan = knownPlanId && knownPlanId in PLAN_META;

  return {
    id: parent.id,
    name: `${parent.firstName} ${parent.lastName}`.trim(),
    email: parent.user.email,
    phone: "—",
    location: "—",
    status,
    children: parent.children.map((child) => ({
      name: child.name,
      age: 0,
      grade: child.grade,
    })),
    paymentStatus: parent.paymentStatus,
    joinedDate: new Date(parent.user.createdAt).toLocaleDateString("fr-FR", {
      month: "short",
      year: "numeric",
    }),
    planId: isKnownPlan ? knownPlanId : undefined,
    notes: parent.notes ?? "",
    totalPayments: parent.totalPayments,
    monthlyFee: parent.monthlyFee ?? undefined,
  };
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="dash-card p-4 flex flex-col gap-3">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ background: bg }}
      >
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div>
        <p className="text-xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-[11px] text-muted-foreground/70">{sub}</p>
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
  const { data: studentsData = [] } = useStudents();
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
  const initials = getParentInitials(currentParent.name);
  const plan = getPlanMeta(currentParent.planId);

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
      {/* Top bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background px-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/parents">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 rounded-xl text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Parents
            </Button>
          </Link>
          <span className="text-border/80">/</span>
          <span className="text-sm font-medium text-foreground">
            {currentParent.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentParent.status === "active" && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 rounded-xl"
                onClick={() => setConfirmAction("deactivate")}
              >
                <XCircle className="h-3.5 w-3.5" />
                Désactiver
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 rounded-xl text-orange-600 border-orange-200 hover:bg-orange-50"
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
              className="gap-1.5 rounded-xl text-white"
              style={{ background: "oklch(0.58 0.16 155)" }}
              onClick={() => setConfirmAction("activate")}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Réactiver
            </Button>
          )}
        </div>
      </header>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl p-6 space-y-6">
          {/* Profile hero */}
          <div className="dash-card overflow-hidden">
            <div
              className="h-24 w-full"
              style={{
                background: `linear-gradient(135deg, ${PARENT_COLOR}28 0%, ${PARENT_COLOR}10 100%)`,
                borderBottom: `1px solid ${PARENT_COLOR}20`,
              }}
            />
            <div className="px-6 pb-6">
              <div className="-mt-10 mb-4 flex items-end justify-between">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-md ring-4 ring-card"
                  style={{ background: PARENT_COLOR }}
                >
                  {initials}
                </div>
                <div className="flex items-center gap-2">
                  <PaymentStatusBadge status={currentParent.paymentStatus} />
                  <StatusBadge status={currentParent.status} />
                </div>
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground">
                  {currentParent.name}
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {currentParent.location}
                  </div>
                  <span className="text-muted-foreground/40">·</span>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Membre depuis {currentParent.joinedDate}
                  </div>
                </div>
              </div>

              {/* Contact pills */}
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  { icon: Mail, label: currentParent.email },
                  { icon: Phone, label: currentParent.phone },
                  { icon: MapPin, label: currentParent.location },
                ].map(({ icon: Icon, label }, index) => (
                  <div
                    key={`${label}-${index}`}
                    className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-xs text-foreground/70"
                  >
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    {label}
                  </div>
                ))}
                {plan && (
                  <div
                    className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold"
                    style={{
                      background: `${plan.color}12`,
                      borderColor: `${plan.color}30`,
                      color: plan.color,
                    }}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {plan.name}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={Baby}
              label="Enfants inscrits"
              value={currentParent.children.length}
              sub={
                currentParent.children.length > 0
                  ? currentParent.children.map((c) => c.name).join(", ")
                  : "aucun enfant"
              }
              color={PARENT_COLOR}
              bg="oklch(0.93 0.02 250)"
            />
            <StatCard
              icon={CreditCard}
              label="Total payé"
              value={
                currentParent.totalPayments
                  ? formatCurrency(currentParent.totalPayments)
                  : "—"
              }
              sub="depuis l'inscription"
              color="oklch(0.58 0.16 155)"
              bg="oklch(0.95 0.018 155)"
            />
            <StatCard
              icon={CreditCard}
              label="Frais mensuels"
              value={
                currentParent.monthlyFee
                  ? formatCurrency(currentParent.monthlyFee)
                  : "—"
              }
              sub="par mois"
              color="oklch(0.62 0.16 80)"
              bg="oklch(0.95 0.03 80)"
            />
            <StatCard
              icon={CalendarDays}
              label="Prochain paiement"
              value={currentParent.nextPaymentDate ?? "—"}
              sub={
                currentParent.lastPaymentDate &&
                currentParent.lastPaymentDate !== "—"
                  ? `Dernier: ${currentParent.lastPaymentDate}`
                  : "aucun paiement enregistré"
              }
              color="oklch(0.52 0.14 250)"
              bg="oklch(0.93 0.02 250)"
            />
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left col — 2/3 */}
            <div className="lg:col-span-2 space-y-6">
              {/* Children list */}
              <div className="dash-card p-5">
                <h2 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
                  <Baby className="h-4 w-4" style={{ color: PARENT_COLOR }} />
                  Enfants inscrits
                </h2>
                {currentParent.children.length > 0 ? (
                  <div className="space-y-3">
                    {currentParent.children.map((child, index) => {
                      const childInitials = getParentInitials(child.name);
                      const student = studentsData.find(
                        (s) => s.name === child.name && s.parent.id === id,
                      );
                      const inner = (
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
                          {student && (
                            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                          )}
                        </>
                      );
                      return student ? (
                        <Link
                          key={`${child.name}-${index}`}
                          href={`/dashboard/students/${student.id}`}
                          className="flex items-center gap-4 rounded-xl border border-border/50 px-4 py-3 transition-colors hover:bg-muted/40"
                          style={{ background: `${PARENT_COLOR}06` }}
                        >
                          {inner}
                        </Link>
                      ) : (
                        <div
                          key={`${child.name}-${index}`}
                          className="flex items-center gap-4 rounded-xl border border-border/50 px-4 py-3"
                          style={{ background: `${PARENT_COLOR}06` }}
                        >
                          {inner}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Baby className="h-8 w-8 text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Aucun enfant inscrit pour l&apos;instant
                    </p>
                  </div>
                )}
              </div>

              {/* Plan */}
              {plan && (
                <div className="dash-card p-5">
                  <h2 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
                    <ShieldCheck
                      className="h-4 w-4"
                      style={{ color: plan.color }}
                    />
                    Plan d&apos;abonnement
                  </h2>
                  <div
                    className="rounded-xl border p-4 space-y-4"
                    style={{
                      background: `${plan.color}08`,
                      borderColor: `${plan.color}25`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p
                          className="text-base font-bold"
                          style={{ color: plan.color }}
                        >
                          {plan.name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {plan.description}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-foreground">
                          {plan.price > 0
                            ? formatCurrency(plan.price)
                            : "Sur mesure"}
                        </p>
                        {plan.price > 0 && (
                          <p className="text-[11px] text-muted-foreground">
                            /mois
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Limits */}
                    <div className="space-y-2.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                        Limites & accès
                      </p>
                      {[
                        {
                          label: "Enfants",
                          allowed:
                            plan.maxChildren === null ||
                            currentParent.children.length <=
                              (plan.maxChildren ?? Infinity),
                          detail:
                            plan.maxChildren === null
                              ? `${currentParent.children.length} inscrits · illimité`
                              : `${currentParent.children.length} / ${plan.maxChildren} inscrits`,
                          warning:
                            plan.maxChildren !== null &&
                            currentParent.children.length >= plan.maxChildren,
                        },
                        {
                          label: "Accès aux ressources",
                          allowed: plan.resourceAccess,
                          detail: plan.resourceAccess ? "Inclus" : "Non inclus",
                          warning: false,
                        },
                        {
                          label: "Support prioritaire",
                          allowed: plan.prioritySupport,
                          detail: plan.prioritySupport
                            ? "Inclus"
                            : "Non inclus",
                          warning: false,
                        },
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="flex items-center justify-between gap-4"
                        >
                          <span className="text-xs text-muted-foreground">
                            {row.label}
                          </span>
                          <span
                            className="text-xs font-medium"
                            style={{
                              color: row.warning
                                ? "oklch(0.62 0.16 80)"
                                : row.allowed
                                  ? "oklch(0.38 0.12 155)"
                                  : "oklch(0.48 0.02 250)",
                            }}
                          >
                            {row.detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="dash-card p-5">
                <h2 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
                  <StickyNote className="h-4 w-4 text-muted-foreground" />
                  Notes
                </h2>
                {currentParent.notes ? (
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {currentParent.notes}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Aucune note renseignée.
                  </p>
                )}
              </div>
            </div>

            {/* Right col — 1/3 */}
            <div className="space-y-6">
              {/* Payment history */}
              <div className="dash-card p-5">
                <h2 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  Paiements
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-muted-foreground">
                      Statut actuel
                    </span>
                    <PaymentStatusBadge status={currentParent.paymentStatus} />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-muted-foreground">
                      Total versé
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      {currentParent.totalPayments
                        ? formatCurrency(currentParent.totalPayments)
                        : "—"}
                    </span>
                  </div>
                </div>

                {/* Real orders from Stripe */}
                {ordersData.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                      Historique des commandes
                    </p>
                    {ordersData.slice(0, 5).map((order) => {
                      const statusColors: Record<
                        string,
                        { bg: string; color: string }
                      > = {
                        PAID: {
                          bg: "oklch(0.95 0.018 155)",
                          color: "oklch(0.45 0.14 155)",
                        },
                        PENDING: {
                          bg: "oklch(0.96 0.03 80)",
                          color: "oklch(0.55 0.16 80)",
                        },
                        FAILED: {
                          bg: "oklch(0.94 0.008 20)",
                          color: "oklch(0.45 0.12 20)",
                        },
                        REFUNDED: {
                          bg: "oklch(0.95 0.02 250)",
                          color: "oklch(0.52 0.14 250)",
                        },
                        CANCELLED: {
                          bg: "oklch(0.94 0.005 250)",
                          color: "oklch(0.48 0.02 250)",
                        },
                      };
                      const style =
                        statusColors[order.status] ?? statusColors.PENDING;
                      return (
                        <div
                          key={order.id}
                          className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">
                              {order.type} —{" "}
                              {formatCurrency(order.amount / 100)}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString(
                                "fr-FR",
                              )}
                            </p>
                          </div>
                          <span
                            className="ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                            style={{ background: style.bg, color: style.color }}
                          >
                            {order.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Account info */}
              <div className="dash-card p-5 space-y-3">
                <h2 className="text-sm font-semibold text-foreground">
                  Informations du compte
                </h2>
                {[
                  { label: "Membre depuis", value: currentParent.joinedDate },
                  { label: "ID parent", value: currentParent.id.toUpperCase() },
                  {
                    label: "Plan",
                    value: plan ? plan.name : "—",
                  },
                  {
                    label: "Statut",
                    value:
                      currentParent.status === "active"
                        ? "Actif"
                        : currentParent.status === "inactive"
                          ? "Inactif"
                          : "Suspendu",
                  },
                ].map(({ label, value }, index) => (
                  <div
                    key={`${label}-${index}`}
                    className="flex items-start justify-between gap-4"
                  >
                    <span className="text-xs text-muted-foreground">
                      {label}
                    </span>
                    <span className="text-xs font-medium text-foreground text-right">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
