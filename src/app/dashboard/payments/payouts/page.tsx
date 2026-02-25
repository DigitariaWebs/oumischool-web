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
import {
  useCreatePayout,
  useTutorPayouts,
  useTutorRevenue,
  useTutorsWithPendingPayouts,
} from "@/hooks/payments";
import { formatCurrency } from "@/lib/utils";
import {
  Banknote,
  CheckCircle2,
  Clock,
  DollarSign,
  Eye,
  Loader2,
  MoreHorizontal,
  Send,
  Wallet,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const PAYOUT_COLOR = "oklch(0.58 0.16 155)";

interface TutorWithEarnings {
  id: string;
  name: string;
  email: string;
  totalEarnings: number;
  totalPaid: number;
  pendingAmount: number;
}

const PAYOUT_STATUS_LABELS: Record<
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

function PayoutHistory({ tutorId }: { tutorId: string }) {
  const { data: payouts = [], isLoading } = useTutorPayouts(tutorId);
  const { data: revenueData } = useTutorRevenue(tutorId);

  const totalRevenue = revenueData?.total ?? 0;
  const totalPaid = payouts
    .filter((p) => p.status === "PAID")
    .reduce((acc, p) => acc + p.amount, 0);
  const pendingAmount = totalRevenue - totalPaid;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div
          className="flex flex-col items-center gap-1.5 rounded-xl p-3"
          style={{ background: "oklch(0.95 0.018 155)" }}
        >
          <DollarSign
            className="h-4 w-4"
            style={{ color: "oklch(0.58 0.16 155)" }}
          />
          <span
            className="text-sm font-bold"
            style={{ color: "oklch(0.58 0.16 155)" }}
          >
            {formatCurrency(totalRevenue)}
          </span>
          <span className="text-[10px] text-muted-foreground">Total gagné</span>
        </div>
        <div
          className="flex flex-col items-center gap-1.5 rounded-xl p-3"
          style={{ background: "oklch(0.93 0.02 250)" }}
        >
          <CheckCircle2
            className="h-4 w-4"
            style={{ color: "oklch(0.52 0.14 250)" }}
          />
          <span
            className="text-sm font-bold"
            style={{ color: "oklch(0.52 0.14 250)" }}
          >
            {formatCurrency(totalPaid)}
          </span>
          <span className="text-[10px] text-muted-foreground">Total payé</span>
        </div>
        <div
          className="flex flex-col items-center gap-1.5 rounded-xl p-3"
          style={{
            background:
              pendingAmount > 0
                ? "oklch(0.96 0.025 20)"
                : "oklch(0.95 0.03 80)",
          }}
        >
          <Wallet
            className="h-4 w-4"
            style={{
              color:
                pendingAmount > 0
                  ? "oklch(0.58 0.16 20)"
                  : "oklch(0.62 0.16 80)",
            }}
          />
          <span
            className="text-sm font-bold"
            style={{
              color:
                pendingAmount > 0
                  ? "oklch(0.58 0.16 20)"
                  : "oklch(0.62 0.16 80)",
            }}
          >
            {formatCurrency(pendingAmount)}
          </span>
          <span className="text-[10px] text-muted-foreground">En attente</span>
        </div>
      </div>

      {payouts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Aucun paiement effectué
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
            Historique des paiements
          </p>
          {payouts.map((payout) => {
            const statusInfo =
              PAYOUT_STATUS_LABELS[payout.status] ||
              PAYOUT_STATUS_LABELS.RECORDED;
            return (
              <div
                key={payout.id}
                className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ background: statusInfo.bg }}
                  >
                    {payout.status === "PAID" ? (
                      <CheckCircle2
                        className="h-4 w-4"
                        style={{ color: statusInfo.color }}
                      />
                    ) : payout.status === "FAILED" ? (
                      <XCircle
                        className="h-4 w-4"
                        style={{ color: statusInfo.color }}
                      />
                    ) : (
                      <Clock
                        className="h-4 w-4"
                        style={{ color: statusInfo.color }}
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {formatCurrency(payout.amount)}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      {payout.method && <span>{payout.method}</span>}
                      {payout.paidAt && (
                        <span>
                          ·{" "}
                          {new Date(payout.paidAt).toLocaleDateString("fr-FR")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{ background: statusInfo.bg, color: statusInfo.color }}
                >
                  {statusInfo.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function buildTutorColumns(
  onView: (t: TutorWithEarnings) => void,
  onProcessPayout: (t: TutorWithEarnings) => void,
): ColumnDef<TutorWithEarnings>[] {
  return [
    {
      key: "name",
      label: "Tuteur",
      sortable: true,
      render: (tutor) => {
        const initials = tutor.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: PAYOUT_COLOR }}
            >
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {tutor.name}
              </p>
              <p className="text-[11px] text-muted-foreground">{tutor.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "totalEarnings",
      label: "Total gagné",
      sortable: true,
      render: (tutor) => (
        <span className="text-sm font-medium text-foreground">
          {formatCurrency(tutor.totalEarnings)}
        </span>
      ),
    },
    {
      key: "totalPaid",
      label: "Total payé",
      sortable: true,
      render: (tutor) => (
        <span className="text-sm text-green-600">
          {formatCurrency(tutor.totalPaid)}
        </span>
      ),
    },
    {
      key: "pendingAmount",
      label: "En attente",
      sortable: true,
      render: (tutor) => (
        <span
          className={`text-sm font-semibold ${
            tutor.pendingAmount > 0
              ? "text-orange-600"
              : "text-muted-foreground"
          }`}
        >
          {formatCurrency(tutor.pendingAmount)}
        </span>
      ),
    },
    {
      key: "id",
      label: "Actions",
      sortable: false,
      render: (tutor) => (
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
              onClick={() => onView(tutor)}
            >
              <Eye className="h-3.5 w-3.5" />
              Voir les détails
            </DropdownMenuItem>
            {tutor.pendingAmount > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 text-xs text-green-600 focus:text-green-600 focus:bg-green-50"
                  onClick={() => onProcessPayout(tutor)}
                >
                  <Send className="h-3.5 w-3.5" />
                  Effectuer le paiement
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}

export default function PayoutsPage() {
  const { data: tutorsData = [], isLoading: tutorsLoading } =
    useTutorsWithPendingPayouts();
  const createPayout = useCreatePayout();

  const [selectedTutor, setSelectedTutor] = useState<TutorWithEarnings | null>(
    null,
  );
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutForm, setPayoutForm] = useState({
    amount: 0,
    method: "Virement bancaire",
    reference: "",
  });

  const tutorsWithEarnings: TutorWithEarnings[] = tutorsData.map((tutor) => {
    return {
      id: tutor.tutorId,
      name: tutor.tutorName,
      email: tutor.email,
      totalEarnings: tutor.totalEarnings,
      totalPaid: tutor.totalPaid,
      pendingAmount: tutor.pendingAmount,
    };
  });

  const columns = buildTutorColumns(setSelectedTutor, (t) => {
    setSelectedTutor(t);
    setPayoutForm({
      amount: t.pendingAmount,
      method: "Virement bancaire",
      reference: "",
    });
    setShowPayoutModal(true);
  });

  const handleProcessPayout = async () => {
    if (!selectedTutor || payoutForm.amount <= 0) return;
    await createPayout.mutateAsync({
      tutorId: selectedTutor.id,
      payload: {
        amount: payoutForm.amount,
        method: payoutForm.method,
        reference: payoutForm.reference || undefined,
        status: "PAID",
      },
    });
    setShowPayoutModal(false);
    setSelectedTutor(null);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background px-6">
        <div>
          <h1 className="flex items-center gap-2 text-base font-semibold text-foreground tracking-tight">
            <Banknote className="h-4 w-4 text-muted-foreground" />
            Paiements
          </h1>
          <p className="text-xs text-muted-foreground">
            Gérer les paiements des tuteurs
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        {tutorsLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : tutorsWithEarnings.length === 0 ? (
          <EmptyState
            title="Aucun tuteur"
            description="Aucun tuteur n'a encore été inscrit sur la plateforme."
          />
        ) : (
          <DataTable
            data={tutorsWithEarnings}
            columns={columns}
            searchKeys={["name", "email"]}
            itemsPerPage={10}
            onRowClick={setSelectedTutor}
          />
        )}
      </div>

      <Modal
        open={!!selectedTutor && !showPayoutModal}
        onOpenChange={(open) => !open && setSelectedTutor(null)}
        type="details"
        title="Détails des paiements"
        description="Historique des paiements du tuteur."
        size="md"
        icon={null}
        actions={{
          primary:
            selectedTutor && selectedTutor.pendingAmount > 0
              ? {
                  label: "Effectuer un paiement",
                  onClick: () => {
                    if (selectedTutor) {
                      setPayoutForm({
                        amount: selectedTutor.pendingAmount,
                        method: "Virement bancaire",
                        reference: "",
                      });
                      setShowPayoutModal(true);
                    }
                  },
                  icon: <Send className="h-3.5 w-3.5" />,
                }
              : undefined,
          secondary: {
            label: "Fermer",
            onClick: () => setSelectedTutor(null),
            variant: "outline",
          },
        }}
      >
        {selectedTutor && <PayoutHistory tutorId={selectedTutor.id} />}
      </Modal>

      <Modal
        open={showPayoutModal}
        onOpenChange={setShowPayoutModal}
        type="form"
        title="Effectuer un paiement"
        description={`Paiement pour ${selectedTutor?.name || "le tuteur"}`}
        size="sm"
        actions={{
          primary: {
            label: createPayout.isPending
              ? "Traitement..."
              : "Confirmer le paiement",
            onClick: handleProcessPayout,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setShowPayoutModal(false),
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Montant à payer
              </span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(payoutForm.amount)}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="payout-method">Méthode de paiement</Label>
            <select
              id="payout-method"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={payoutForm.method}
              onChange={(e) =>
                setPayoutForm((f) => ({ ...f, method: e.target.value }))
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
              placeholder="Numéro de transaction, référence..."
              value={payoutForm.reference}
              onChange={(e) =>
                setPayoutForm((f) => ({ ...f, reference: e.target.value }))
              }
            />
          </div>

          {createPayout.isError && (
            <p className="text-xs text-destructive">
              Impossible de traiter le paiement.
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
