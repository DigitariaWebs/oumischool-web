"use client";

import type { ColumnDef } from "@/components/ui/DataTable";
import { DataTable } from "@/components/ui/DataTable";
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
import { PaymentStatusBadge, StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useActivateParent,
  useCreateParent,
  useDeactivateParent,
  useParents,
  useSuspendParent,
} from "@/hooks/parents";
import {
  adaptParent,
  getPlanMeta,
  getParentInitials,
  PLAN_META,
} from "@/lib/parents";
import { formatCurrency } from "@/lib/utils";
import { Parent } from "@/types";
import {
  Baby,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  Eye,
  Loader2,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  ShieldCheck,
  UsersRound,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PARENT_COLOR = "oklch(0.52 0.14 250)";

// ─── Quick-view modal content ─────────────────────────────────────────────────

function ParentQuickView({ parent }: { parent: Parent }) {
  const initials = getParentInitials(parent.name);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-sm"
          style={{ background: PARENT_COLOR }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-foreground">
              {parent.name}
            </h3>
            <StatusBadge status={parent.status} />
          </div>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <PaymentStatusBadge status={parent.paymentStatus} />
            {parent.planId &&
              (() => {
                const plan = getPlanMeta(parent.planId);
                return plan ? (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ background: `${plan.color}18`, color: plan.color }}
                  >
                    <ShieldCheck className="h-3 w-3" />
                    {plan.name}
                  </span>
                ) : null;
              })()}
            <span className="text-muted-foreground/40">·</span>
            <span className="text-xs text-muted-foreground">
              Membre depuis {parent.joinedDate}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Enfants",
            value: parent.children.length,
            icon: Baby,
            color: PARENT_COLOR,
            bg: "oklch(0.93 0.02 250)",
          },
          {
            label: "Total payé",
            value: parent.totalPayments
              ? formatCurrency(parent.totalPayments)
              : "—",
            icon: CreditCard,
            color: "oklch(0.58 0.16 155)",
            bg: "oklch(0.95 0.018 155)",
          },
          {
            label: "Frais / mois",
            value: parent.monthlyFee ? formatCurrency(parent.monthlyFee) : "—",
            icon: CreditCard,
            color: "oklch(0.62 0.16 80)",
            bg: "oklch(0.95 0.03 80)",
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

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Mail, label: parent.email },
          { icon: Phone, label: parent.phone },
          { icon: MapPin, label: parent.location },
          {
            icon: CalendarDays,
            label: parent.nextPaymentDate
              ? `Prochain: ${parent.nextPaymentDate}`
              : "Date de paiement N/D",
          },
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

      {parent.children.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
            Enfants inscrits
          </p>
          <div className="space-y-2">
            {parent.children.map((child, index) => {
              const childInitials = getParentInitials(child.name);
              return (
                <div
                  key={`${child.name}-${index}`}
                  className="flex items-center gap-3 rounded-xl border border-border/50 px-3 py-2"
                  style={{ background: `${PARENT_COLOR}08` }}
                >
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ background: PARENT_COLOR }}
                  >
                    {childInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">
                      {child.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {child.grade} · {child.age} ans
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {parent.planId &&
        (() => {
          const plan = getPlanMeta(parent.planId);
          if (!plan) return null;
          return (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                Plan
              </p>
              <div
                className="rounded-xl border p-3 space-y-2"
                style={{
                  background: `${plan.color}08`,
                  borderColor: `${plan.color}20`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: plan.color }}
                  >
                    {plan.name}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {(parent.monthlyFee ?? plan.price) > 0
                      ? `${formatCurrency(parent.monthlyFee ?? plan.price)}/mois`
                      : "Sur mesure"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {plan.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{ background: `${plan.color}15`, color: plan.color }}
                  >
                    {plan.maxChildren === null
                      ? "Enfants illimités"
                      : `Max ${plan.maxChildren} enfant${plan.maxChildren > 1 ? "s" : ""}`}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={
                      plan.resourceAccess
                        ? {
                            background: "oklch(0.95 0.018 155)",
                            color: "oklch(0.38 0.12 155)",
                          }
                        : {
                            background: "oklch(0.94 0.008 80)",
                            color: "oklch(0.48 0.02 250)",
                          }
                    }
                  >
                    {plan.resourceAccess
                      ? "Ressources incluses"
                      : "Sans ressources"}
                  </span>
                  {plan.prioritySupport && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        background: "oklch(0.96 0.03 80)",
                        color: "oklch(0.52 0.14 80)",
                      }}
                    >
                      Support prioritaire
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

      {parent.notes && (
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
            Notes
          </p>
          <p className="text-sm text-foreground/70 leading-relaxed rounded-xl bg-muted/40 px-3 py-2.5">
            {parent.notes}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Row actions ─────────────────────────────────────────────────────────────

function ParentActions({
  parent,
  onView,
  onActivate,
  onSuspend,
  onDeactivate,
}: {
  parent: Parent;
  onView: (p: Parent) => void;
  onActivate?: (p: Parent) => void;
  onSuspend?: (p: Parent) => void;
  onDeactivate?: (p: Parent) => void;
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
          onClick={() => onView(parent)}
        >
          <Eye className="h-3.5 w-3.5" />
          Aperçu rapide
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-xs" asChild>
          <a href={`/dashboard/parents/${parent.id}`}>
            <ExternalLink className="h-3.5 w-3.5" />
            Profil complet
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {parent.status === "inactive" && onActivate && (
          <DropdownMenuItem
            className="gap-2 text-xs text-green-700 focus:text-green-700 focus:bg-green-50"
            onClick={() => onActivate(parent)}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Activer
          </DropdownMenuItem>
        )}
        {parent.status === "active" && onSuspend && (
          <DropdownMenuItem
            className="gap-2 text-xs text-orange-600 focus:text-orange-600 focus:bg-orange-50"
            onClick={() => onSuspend(parent)}
          >
            <Clock className="h-3.5 w-3.5" />
            Suspendre
          </DropdownMenuItem>
        )}
        {parent.status !== "inactive" && onDeactivate && (
          <DropdownMenuItem
            className="gap-2 text-xs text-red-600 focus:text-red-600 focus:bg-red-50"
            onClick={() => onDeactivate(parent)}
          >
            <XCircle className="h-3.5 w-3.5" />
            Désactiver
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Table columns ────────────────────────────────────────────────────────────

function buildColumns(
  onView: (p: Parent) => void,
  onActivate?: (p: Parent) => void,
  onSuspend?: (p: Parent) => void,
  onDeactivate?: (p: Parent) => void,
): ColumnDef<Parent>[] {
  return [
    {
      key: "name",
      label: "Parent",
      sortable: true,
      render: (parent) => {
        const initials = getParentInitials(parent.name);
        return (
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: PARENT_COLOR }}
            >
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {parent.name}
              </p>
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Mail className="h-3 w-3" />
                {parent.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "phone",
      label: "Téléphone",
      sortable: false,
      render: (parent) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Phone className="h-3.5 w-3.5" />
          {parent.phone}
        </div>
      ),
    },
    {
      key: "location",
      label: "Emplacement",
      sortable: true,
      render: (parent) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {parent.location}
        </div>
      ),
    },
    {
      key: "children",
      label: "Enfants",
      sortable: false,
      render: (parent) => (
        <div className="flex items-center gap-1.5">
          <Baby className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {parent.children.length}
          </span>
          <span className="text-xs text-muted-foreground">
            {parent.children.length === 1 ? "enfant" : "enfants"}
          </span>
        </div>
      ),
    },
    {
      key: "planId",
      label: "Plan",
      sortable: true,
      render: (parent) => {
        if (!parent.planId)
          return <span className="text-xs text-muted-foreground">—</span>;
        const plan = getPlanMeta(parent.planId);
        if (!plan) return null;
        return (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ background: `${plan.color}15`, color: plan.color }}
          >
            <ShieldCheck className="h-3 w-3" />
            {plan.name}
          </span>
        );
      },
    },
    {
      key: "paymentStatus",
      label: "Paiement",
      sortable: true,
      render: (parent) => <PaymentStatusBadge status={parent.paymentStatus} />,
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (parent) => <StatusBadge status={parent.status} />,
    },
    {
      key: "joinedDate",
      label: "Rejoint",
      sortable: true,
      render: (parent) => (
        <span className="text-sm text-muted-foreground">
          {parent.joinedDate}
        </span>
      ),
    },
    {
      key: "id",
      label: "Actions",
      sortable: false,
      render: (parent) => (
        <ParentActions
          parent={parent}
          onView={onView}
          onActivate={onActivate}
          onSuspend={onSuspend}
          onDeactivate={onDeactivate}
        />
      ),
    },
  ];
}

// ─── Static data ─────────────────────────────────────────────────────────────

const filters = [
  {
    key: "status",
    label: "Statut",
    options: [
      { label: "Actif", value: "active" },
      { label: "Inactif", value: "inactive" },
      { label: "Suspendu", value: "suspended" },
    ],
  },
  {
    key: "paymentStatus",
    label: "Paiement",
    options: [
      { label: "Payé", value: "paid" },
      { label: "En attente", value: "pending" },
      { label: "En retard", value: "overdue" },
    ],
  },
  {
    key: "planId",
    label: "Plan",
    options: Object.entries(PLAN_META).map(([id, plan]) => ({
      label: plan.name,
      value: id,
    })),
  },
];

const defaultFormState: {
  name: string;
  email: string;
  phone: string;
  location: string;
} = {
  name: "",
  email: "",
  phone: "",
  location: "",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ParentsPage() {
  const router = useRouter();
  const { data: parentsData = [], isLoading } = useParents();
  const createParent = useCreateParent();
  const activateParent = useActivateParent();
  const suspendParent = useSuspendParent();
  const deactivateParent = useDeactivateParent();

  const [addOpen, setAddOpen] = useState(false);
  const [viewParent, setViewParent] = useState<Parent | null>(null);
  const [form, setForm] = useState(defaultFormState);

  const parents = parentsData.map(adaptParent);

  const activeParents = parents.filter((p) => p.status === "active");
  const inactiveParents = parents.filter((p) => p.status === "inactive");
  const suspendedParents = parents.filter((p) => p.status === "suspended");
  const overdueParents = parents.filter((p) => p.paymentStatus === "overdue");

  const totalChildren = parents.reduce((acc, p) => acc + p.children.length, 0);

  const handleAdd = async () => {
    if (!form.name || !form.email) return;
    const parts = form.name.trim().split(" ");
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ") || parts[0];
    await createParent.mutateAsync({
      firstName,
      lastName,
      email: form.email,
      phone: form.phone || undefined,
    });
    setForm(defaultFormState);
    setAddOpen(false);
  };

  const handleActivate = async (parent: Parent) => {
    await activateParent.mutateAsync(parent.id).catch(() => {});
  };

  const handleSuspend = async (parent: Parent) => {
    await suspendParent.mutateAsync(parent.id).catch(() => {});
  };

  const handleDeactivate = async (parent: Parent) => {
    await deactivateParent.mutateAsync(parent.id).catch(() => {});
  };

  const columns = buildColumns(
    setViewParent,
    handleActivate,
    handleSuspend,
    handleDeactivate,
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background px-4 md:px-6">
        <div>
          <h1 className="flex items-center gap-2 text-base font-semibold text-foreground tracking-tight">
            <UsersRound className="h-4 w-4 text-muted-foreground" />
            Parents
          </h1>
          <p className="text-xs text-muted-foreground">
            {parents.length} parents · {totalChildren} enfants inscrits
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 rounded-xl text-white"
          style={{ background: PARENT_COLOR }}
          onClick={() => setAddOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Ajouter parent
        </Button>
      </header>

      {/* Tabs + content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="all" className="h-full">
          <TabsList
            variant="line"
            className="w-full justify-start border-b border-border/60 rounded-none pb-0 h-auto bg-background px-6"
          >
            <TabsTrigger value="all" className="gap-1.5 pb-3">
              Tous les parents
              <span
                className="rounded-full px-1.5 py-0 text-[10px] font-semibold"
                style={{
                  background: "oklch(0.94 0.008 80)",
                  color: "oklch(0.48 0.02 250)",
                }}
              >
                {parents.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="active" className="gap-1.5 pb-3">
              Actifs
              <span
                className="rounded-full px-1.5 py-0 text-[10px] font-semibold"
                style={{
                  background: "oklch(0.95 0.018 155)",
                  color: "oklch(0.38 0.12 155)",
                }}
              >
                {activeParents.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="inactive" className="gap-1.5 pb-3">
              Inactifs
              <span
                className="rounded-full px-1.5 py-0 text-[10px] font-semibold"
                style={{
                  background: "oklch(0.94 0.008 80)",
                  color: "oklch(0.48 0.02 250)",
                }}
              >
                {inactiveParents.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="suspended" className="gap-1.5 pb-3">
              Suspendus
              {suspendedParents.length > 0 && (
                <span
                  className="rounded-full px-1.5 py-0 text-[10px] font-semibold"
                  style={{
                    background: "oklch(0.96 0.025 20)",
                    color: "oklch(0.48 0.16 20)",
                  }}
                >
                  {suspendedParents.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="overdue" className="gap-1.5 pb-3">
              Paiement en retard
              {overdueParents.length > 0 && (
                <span
                  className="rounded-full px-1.5 py-0 text-[10px] font-semibold"
                  style={{
                    background: "oklch(0.96 0.025 20)",
                    color: "oklch(0.48 0.16 20)",
                  }}
                >
                  {overdueParents.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Overdue payment banner */}
          {overdueParents.length > 0 && (
            <div
              className="mx-6 mt-3 flex items-start gap-3 rounded-xl border px-4 py-3"
              style={{
                background: "oklch(0.96 0.025 20)",
                borderColor: "oklch(0.88 0.08 20)",
              }}
            >
              <Clock
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: "oklch(0.48 0.16 20)" }}
              />
              <p
                className="text-xs leading-relaxed"
                style={{ color: "oklch(0.38 0.14 20)" }}
              >
                <strong>
                  {overdueParents.length} parent
                  {overdueParents.length > 1 ? "s" : ""}
                </strong>{" "}
                avec des paiements en retard. Pensez à les contacter pour
                régulariser leur situation.
              </p>
            </div>
          )}

          <TabsContent value="all" className="p-4 md:p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : parents.length === 0 ? (
              <EmptyState
                title="Aucun parent"
                description="Aucun parent n'a encore été inscrit sur la plateforme."
              />
            ) : (
              <DataTable
                data={parents}
                columns={columns}
                filters={filters}
                searchKeys={["name", "email", "location"]}
                itemsPerPage={8}
                onRowClick={setViewParent}
              />
            )}
          </TabsContent>

          <TabsContent value="active" className="p-4 md:p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : activeParents.length === 0 ? (
              <EmptyState
                title="Aucun parent actif"
                description="Aucun parent actif pour le moment."
              />
            ) : (
              <DataTable
                data={activeParents}
                columns={columns}
                filters={filters}
                searchKeys={["name", "email", "location"]}
                itemsPerPage={8}
                onRowClick={setViewParent}
              />
            )}
          </TabsContent>

          <TabsContent value="inactive" className="p-4 md:p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : inactiveParents.length === 0 ? (
              <EmptyState
                title="Aucun parent inactif"
                description="Tous les parents sont actifs."
              />
            ) : (
              <DataTable
                data={inactiveParents}
                columns={columns}
                filters={filters}
                searchKeys={["name", "email", "location"]}
                itemsPerPage={8}
                onRowClick={setViewParent}
              />
            )}
          </TabsContent>

          <TabsContent value="suspended" className="p-4 md:p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : suspendedParents.length === 0 ? (
              <EmptyState
                title="Aucun parent suspendu"
                description="Aucun parent suspendu pour le moment."
              />
            ) : (
              <DataTable
                data={suspendedParents}
                columns={columns}
                filters={filters}
                searchKeys={["name", "email", "location"]}
                itemsPerPage={8}
                onRowClick={setViewParent}
              />
            )}
          </TabsContent>

          <TabsContent value="overdue" className="p-4 md:p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : overdueParents.length === 0 ? (
              <EmptyState
                title="Aucun paiement en retard"
                description="Tous les parents sont à jour dans leurs paiements."
              />
            ) : (
              <DataTable
                data={overdueParents}
                columns={columns}
                filters={filters}
                searchKeys={["name", "email", "location"]}
                itemsPerPage={8}
                onRowClick={setViewParent}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick-view modal */}
      <Modal
        open={!!viewParent}
        onOpenChange={(open) => !open && setViewParent(null)}
        type="details"
        title="Profil du parent"
        description="Aperçu rapide — ouvrez le profil complet pour tous les détails."
        size="md"
        icon={null}
        actions={{
          primary: viewParent
            ? {
                label: "Ouvrir le profil complet",
                onClick: () => {
                  router.push(`/dashboard/parents/${viewParent.id}`);
                },
                icon: <ExternalLink className="h-3.5 w-3.5" />,
              }
            : undefined,
          secondary: {
            label: "Fermer",
            onClick: () => setViewParent(null),
            variant: "outline",
          },
        }}
      >
        {viewParent && <ParentQuickView parent={viewParent} />}
      </Modal>

      {/* Add Parent Modal */}
      <Modal
        open={addOpen}
        onOpenChange={setAddOpen}
        type="form"
        title="Ajouter un nouveau parent"
        description="Inscrire un nouveau compte parent. Vous pouvez ajouter leurs enfants par la suite."
        size="md"
        actions={{
          primary: {
            label: createParent.isPending
              ? "Ajout en cours…"
              : "Ajouter parent",
            onClick: handleAdd,
          },
          secondary: {
            label: "Annuler",
            onClick: () => {
              setForm(defaultFormState);
              setAddOpen(false);
            },
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="parent-name">Nom complet</Label>
              <Input
                id="parent-name"
                placeholder="ex. Paulo Gavi"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="parent-email">E-mail</Label>
              <Input
                id="parent-email"
                type="email"
                placeholder="parent@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="parent-phone">Téléphone</Label>
              <Input
                id="parent-phone"
                placeholder="+1 514 661 0200"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="parent-location">Emplacement</Label>
              <Input
                id="parent-location"
                placeholder="ex. Montréal, Canada"
                value={form.location}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
                }
              />
            </div>
          </div>
          {createParent.isError && (
            <p className="text-xs text-destructive">
              Impossible de créer le parent.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}

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
        <CheckCircle2
          className="h-7 w-7"
          style={{ color: "oklch(0.58 0.16 155)" }}
        />
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
