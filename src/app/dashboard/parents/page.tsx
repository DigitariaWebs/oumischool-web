"use client";

import type { ColumnDef } from "@/components/ui/DataTable";
import { DataTable } from "@/components/ui/DataTable";
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
import { PaymentStatusBadge, StatusBadge } from "@/components/ui/status-badge";
import {
  PARENT_COLOR,
  formatCurrency,
  getParentInitials,
  getPlanById,
  mockParents,
  mockPlans,
} from "@/lib/data/parents";
import { Parent, ParentStatus, PaymentStatus, PlanId } from "@/types";
import {
  Baby,
  CreditCard,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { useState } from "react";

// ─── Quick-view modal content ─────────────────────────────────────────────────

function ParentQuickView({ parent }: { parent: Parent }) {
  const initials = getParentInitials(parent.name);

  return (
    <div className="space-y-6">
      {/* Profile header */}
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
                const plan = getPlanById(parent.planId);
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

      {/* Stats row */}
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

      {/* Contact & details */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Mail, label: parent.email },
          { icon: Phone, label: parent.phone },
          { icon: MapPin, label: parent.location },
          {
            icon: CreditCard,
            label: parent.nextPaymentDate
              ? `Prochain: ${parent.nextPaymentDate}`
              : "Date de paiement N/D",
          },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5"
          >
            <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="text-xs text-foreground/80 truncate">{label}</span>
          </div>
        ))}
      </div>

      {/* Children */}
      {parent.children.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
            Enfants inscrits
          </p>
          <div className="space-y-2">
            {parent.children.map((child) => {
              const childInitials = getParentInitials(child.name);
              return (
                <div
                  key={child.name}
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

      {/* Plan */}
      {parent.planId &&
        (() => {
          const plan = getPlanById(parent.planId);
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
                    {plan.price > 0
                      ? `${formatCurrency(plan.price)}/mois`
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

      {/* Notes */}
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

// ─── Table columns ────────────────────────────────────────────────────────────

function buildColumns(): ColumnDef<Parent>[] {
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
        const plan = getPlanById(parent.planId);
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
  ];
}

// ─── Static data ──────────────────────────────────────────────────────────────

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
    options: mockPlans.map((p) => ({ label: p.name, value: p.id })),
  },
];

const defaultFormState: {
  name: string;
  email: string;
  phone: string;
  location: string;
  status: ParentStatus;
  paymentStatus: PaymentStatus;
  planId: PlanId;
} = {
  name: "",
  email: "",
  phone: "",
  location: "",
  status: "active",
  paymentStatus: "pending",
  planId: "starter",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ParentsPage() {
  const [parents, setParents] = useState<Parent[]>(mockParents);
  const [addOpen, setAddOpen] = useState(false);
  const [viewParent, setViewParent] = useState<Parent | null>(null);
  const [form, setForm] = useState(defaultFormState);

  const totalChildren = parents.reduce((acc, p) => acc + p.children.length, 0);

  const handleAdd = () => {
    if (!form.name || !form.email) return;
    const newParent: Parent = {
      id: `par${Date.now()}`,
      name: form.name,
      email: form.email,
      phone: form.phone,
      location: form.location || "—",
      status: form.status,
      children: [],
      paymentStatus: form.paymentStatus,
      planId: form.planId,
      joinedDate: new Date().toLocaleDateString("fr-FR", {
        month: "short",
        year: "numeric",
      }),
      notes: "",
      totalPayments: 0,
      lastPaymentDate: "—",
      nextPaymentDate: "—",
      monthlyFee: 0,
    };
    setParents((prev) => [newParent, ...prev]);
    setForm(defaultFormState);
    setAddOpen(false);
  };

  const columns = buildColumns();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background px-6">
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

      {/* Summary pills */}
      <div className="flex items-center gap-3 border-b border-border/40 bg-background px-6 py-2.5">
        {[
          {
            label: "Actifs",
            count: parents.filter((p) => p.status === "active").length,
            style: {
              background: "oklch(0.95 0.018 155)",
              color: "oklch(0.38 0.12 155)",
            },
          },
          {
            label: "Inactifs",
            count: parents.filter((p) => p.status === "inactive").length,
            style: {
              background: "oklch(0.94 0.008 80)",
              color: "oklch(0.48 0.02 250)",
            },
          },
          {
            label: "Suspendus",
            count: parents.filter((p) => p.status === "suspended").length,
            style: {
              background: "oklch(0.96 0.025 20)",
              color: "oklch(0.48 0.16 20)",
            },
          },
          {
            label: "Paiement en retard",
            count: parents.filter((p) => p.paymentStatus === "overdue").length,
            style: {
              background: "oklch(0.96 0.025 20)",
              color: "oklch(0.48 0.16 20)",
            },
          },
        ].map((pill) => (
          <span
            key={pill.label}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
            style={pill.style}
          >
            {pill.label}: <strong>{pill.count}</strong>
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <DataTable
          data={parents}
          columns={columns}
          filters={filters}
          searchKeys={["name", "email", "location"]}
          itemsPerPage={8}
          onRowClick={setViewParent}
        />
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
                  window.location.href = `/dashboard/parents/${viewParent.id}`;
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
            label: "Ajouter parent",
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Statut du compte</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, status: v as ParentStatus }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="suspended">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Statut de paiement</Label>
              <Select
                value={form.paymentStatus}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    paymentStatus: v as PaymentStatus,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut de paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Payé</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="overdue">En retard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Plan</Label>
            <Select
              value={form.planId}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, planId: v as PlanId }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un plan" />
              </SelectTrigger>
              <SelectContent>
                {mockPlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    <span className="flex items-center gap-2">
                      <ShieldCheck
                        className="h-3.5 w-3.5"
                        style={{ color: plan.color }}
                      />
                      {plan.name}
                      <span className="text-muted-foreground text-xs">
                        —{" "}
                        {plan.price > 0
                          ? `${formatCurrency(plan.price)}/mois`
                          : "Sur mesure"}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
