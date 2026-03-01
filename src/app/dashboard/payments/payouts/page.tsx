"use client";

import type { ColumnDef } from "@/components/ui/DataTable";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { usePayouts, useCreatePayout, TutorPayout } from "@/hooks/payments";
import { useTutors } from "@/hooks/tutors";
import { formatCurrency } from "@/lib/utils";
import {
  Banknote,
  CheckCircle2,
  Clock,
  Loader2,
  MoreHorizontal,
  Plus,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const PAYOUT_COLOR = "oklch(0.58 0.16 155)";

const STATUS_META: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  RECORDED: {
    label: "Enregistré",
    color: "oklch(0.55 0.14 250)",
    bg: "oklch(0.93 0.02 250)",
  },
  PAID: {
    label: "Payé",
    color: "oklch(0.58 0.16 155)",
    bg: "oklch(0.95 0.018 155)",
  },
  FAILED: {
    label: "Échoué",
    color: "oklch(0.58 0.16 20)",
    bg: "oklch(0.96 0.025 20)",
  },
};

function buildColumns(): ColumnDef<TutorPayout>[] {
  return [
    {
      key: "tutorId",
      label: "Tuteur",
      sortable: true,
      render: (payout) => {
        const name =
          `${payout.tutor?.firstName ?? ""} ${payout.tutor?.lastName ?? ""}`.trim() ||
          payout.tutor?.user?.email ||
          "—";
        const email = payout.tutor?.user?.email;
        const initials = name.slice(0, 2).toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: PAYOUT_COLOR }}
            >
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{name}</p>
              {email && name !== email && (
                <p className="text-[11px] text-muted-foreground">{email}</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "amount",
      label: "Montant",
      sortable: true,
      render: (payout) => (
        <span className="text-sm font-semibold text-foreground">
          {formatCurrency(payout.amount)}
        </span>
      ),
    },
    {
      key: "method",
      label: "Méthode",
      sortable: false,
      render: (payout) => (
        <span className="text-sm text-muted-foreground">
          {payout.method ?? "—"}
        </span>
      ),
    },
    {
      key: "reference",
      label: "Référence",
      sortable: false,
      render: (payout) => (
        <span className="text-sm text-muted-foreground">
          {payout.reference ?? "—"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (payout) => {
        const meta = STATUS_META[payout.status] ?? STATUS_META.RECORDED;
        return (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ background: meta.bg, color: meta.color }}
          >
            {payout.status === "PAID" ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : payout.status === "FAILED" ? (
              <XCircle className="h-3 w-3" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            {meta.label}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (payout) => (
        <span className="text-sm text-muted-foreground">
          {new Date(payout.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "id",
      label: "Actions",
      sortable: false,
      render: () => (
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
              className="gap-2 text-xs text-muted-foreground"
              disabled
            >
              Aucune action
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}

export default function PayoutsPage() {
  const { data: payouts = [], isLoading } = usePayouts();
  const { data: tutorsData = [] } = useTutors();
  const createPayout = useCreatePayout();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    tutorId: "",
    amount: "",
    method: "Virement bancaire",
    reference: "",
    status: "PAID" as "RECORDED" | "PAID" | "FAILED",
  });

  const columns = buildColumns();

  const handleCreate = async () => {
    if (!form.tutorId || !form.amount) return;
    await createPayout.mutateAsync({
      tutorId: form.tutorId,
      payload: {
        amount: parseFloat(form.amount),
        method: form.method,
        reference: form.reference || undefined,
        status: form.status,
      },
    });
    setShowCreateModal(false);
    setForm({
      tutorId: "",
      amount: "",
      method: "Virement bancaire",
      reference: "",
      status: "PAID",
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background px-4 md:px-6">
        <div>
          <h1 className="flex items-center gap-2 text-base font-semibold text-foreground tracking-tight">
            <Banknote className="h-4 w-4 text-muted-foreground" />
            Virements tuteurs
          </h1>
          <p className="text-xs text-muted-foreground">
            Historique de tous les paiements effectués aux tuteurs
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 text-xs h-8"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          Nouveau paiement
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : payouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ background: "oklch(0.95 0.018 155)" }}
            >
              <Banknote className="h-6 w-6" style={{ color: PAYOUT_COLOR }} />
            </div>
            <p className="text-sm font-medium text-foreground">
              Aucun paiement
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Aucun virement tuteur n&apos;a encore été enregistré.
            </p>
          </div>
        ) : (
          <DataTable
            data={payouts}
            columns={columns}
            searchKeys={[]}
            itemsPerPage={15}
          />
        )}
      </div>

      <Modal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        type="form"
        title="Nouveau paiement tuteur"
        description="Enregistrer un virement effectué à un tuteur."
        size="sm"
        actions={{
          primary: {
            label: createPayout.isPending ? "Traitement..." : "Enregistrer",
            onClick: handleCreate,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setShowCreateModal(false),
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="payout-tutor">Tuteur</Label>
            <select
              id="payout-tutor"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={form.tutorId}
              onChange={(e) =>
                setForm((f) => ({ ...f, tutorId: e.target.value }))
              }
            >
              <option value="">Sélectionner un tuteur</option>
              {tutorsData.map((tutor) => (
                <option key={tutor.id} value={tutor.id}>
                  {`${tutor.firstName ?? ""} ${tutor.lastName ?? ""}`.trim() ||
                    tutor.user.email}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="payout-amount">Montant (€)</Label>
            <Input
              id="payout-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) =>
                setForm((f) => ({ ...f, amount: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="payout-method">Méthode</Label>
            <select
              id="payout-method"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={form.method}
              onChange={(e) =>
                setForm((f) => ({ ...f, method: e.target.value }))
              }
            >
              <option value="Virement bancaire">Virement bancaire</option>
              <option value="PayPal">PayPal</option>
              <option value="Western Union">Western Union</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="payout-reference">Référence (optionnel)</Label>
            <Input
              id="payout-reference"
              placeholder="Numéro de transaction..."
              value={form.reference}
              onChange={(e) =>
                setForm((f) => ({ ...f, reference: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="payout-status">Statut</Label>
            <select
              id="payout-status"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  status: e.target.value as "RECORDED" | "PAID" | "FAILED",
                }))
              }
            >
              <option value="PAID">Payé</option>
              <option value="RECORDED">Enregistré</option>
              <option value="FAILED">Échoué</option>
            </select>
          </div>

          {createPayout.isError && (
            <p className="text-xs text-destructive">
              Impossible d&apos;enregistrer le paiement.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
