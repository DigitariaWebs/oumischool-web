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
import { Modal } from "@/components/ui/modal";
import { PaymentStatusBadge, StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParentDetail, useParents } from "@/hooks/parents";
import { useOrders, useRefundOrder, PaymentOrder } from "@/hooks/payments";
import {
  adaptParent,
  getPlanMeta,
  getParentInitials,
  PLAN_META,
} from "@/lib/parents";
import { formatCurrency } from "@/lib/utils";
import { Parent } from "@/types";
import {
  CheckCircle2,
  CreditCard,
  Eye,
  Loader2,
  MoreHorizontal,
  Receipt,
  RefreshCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const SUBSCRIPTION_COLOR = "oklch(0.52 0.14 250)";

function SubscriptionQuickView({ parentId }: { parentId: string }) {
  const { data: parentData, isLoading } = useParentDetail(parentId);
  const { data: ordersData } = useOrders({ parentId });
  const parent = parentData ? adaptParent(parentData) : null;
  const orders = ordersData || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!parent) return null;

  const plan = parent.planId ? getPlanMeta(parent.planId) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-sm"
          style={{ background: SUBSCRIPTION_COLOR }}
        >
          {getParentInitials(parent.name)}
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
            {plan && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                style={{ background: `${plan.color}18`, color: plan.color }}
              >
                <ShieldCheck className="h-3 w-3" />
                {plan.name}
              </span>
            )}
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
            icon: null,
            color: SUBSCRIPTION_COLOR,
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
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center gap-1.5 rounded-xl p-3"
            style={{ background: s.bg }}
          >
            {s.icon && (
              <s.icon className="h-4 w-4" style={{ color: s.color }} />
            )}
            <span
              className="text-sm font-bold text-center"
              style={{ color: s.color }}
            >
              {s.value}
            </span>
            <span className="text-[10px] text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      {plan && (
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
          </div>
        </div>
      )}

      {orders.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
            Commandes récentes
          </p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">
                    {order.type === "SUBSCRIPTION"
                      ? "Abonnement"
                      : order.type === "SESSION"
                        ? "Session"
                        : "Ressource"}
                  </span>
                  <span
                    className={`text-[10px] font-medium ${
                      order.status === "PAID"
                        ? "text-green-600"
                        : order.status === "PENDING"
                          ? "text-yellow-600"
                          : order.status === "REFUNDED"
                            ? "text-blue-600"
                            : "text-red-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <span className="text-xs font-medium">
                  {formatCurrency(order.amount / 100)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function OrderQuickView({ order }: { order: PaymentOrder }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background:
                order.status === "PAID"
                  ? "oklch(0.95 0.018 155)"
                  : order.status === "PENDING"
                    ? "oklch(0.95 0.03 80)"
                    : "oklch(0.96 0.025 20)",
            }}
          >
            {order.status === "PAID" ? (
              <CheckCircle2
                className="h-5 w-5"
                style={{ color: "oklch(0.58 0.16 155)" }}
              />
            ) : order.status === "PENDING" ? (
              <Loader2
                className="h-5 w-5 animate-spin"
                style={{ color: "oklch(0.62 0.16 80)" }}
              />
            ) : (
              <XCircle
                className="h-5 w-5"
                style={{ color: "oklch(0.58 0.16 20)" }}
              />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Commande #{order.id.slice(-6).toUpperCase()}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <span
          className={`text-sm font-semibold ${
            order.status === "REFUNDED" ? "text-blue-600" : ""
          }`}
        >
          {formatCurrency(order.amount / 100)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border/50 px-3 py-2">
          <p className="text-[10px] uppercase text-muted-foreground">Type</p>
          <p className="text-sm font-medium">
            {order.type === "SUBSCRIPTION"
              ? "Abonnement"
              : order.type === "SESSION"
                ? "Session"
                : "Ressource"}
          </p>
        </div>
        <div className="rounded-lg border border-border/50 px-3 py-2">
          <p className="text-[10px] uppercase text-muted-foreground">Statut</p>
          <p
            className={`text-sm font-medium ${
              order.status === "PAID"
                ? "text-green-600"
                : order.status === "PENDING"
                  ? "text-yellow-600"
                  : order.status === "REFUNDED"
                    ? "text-blue-600"
                    : "text-red-600"
            }`}
          >
            {order.status === "PAID"
              ? "Payé"
              : order.status === "PENDING"
                ? "En attente"
                : order.status === "REFUNDED"
                  ? "Remboursé"
                  : order.status === "CANCELLED"
                    ? "Annulé"
                    : "Échoué"}
          </p>
        </div>
      </div>

      {order.items.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
            Articles
          </p>
          <div className="space-y-1.5">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-muted-foreground">
                  {item.description}
                </span>
                <span className="font-medium">
                  {formatCurrency(item.unitAmount / 100)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  PAID: "Payé",
  PENDING: "En attente",
  FAILED: "Échoué",
  REFUNDED: "Remboursé",
  CANCELLED: "Annulé",
};

function buildSubscriptionColumns(
  onView: (p: Parent) => void,
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
              style={{ background: SUBSCRIPTION_COLOR }}
            >
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {parent.name}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {parent.email}
              </p>
            </div>
          </div>
        );
      },
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
      key: "monthlyFee",
      label: "Prix/mois",
      sortable: true,
      render: (parent) => (
        <span className="text-sm text-foreground">
          {parent.monthlyFee ? formatCurrency(parent.monthlyFee) : "—"}
        </span>
      ),
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
              Voir les détails
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}

function buildOrderColumns(
  onView: (order: PaymentOrder) => void,
  onRefund: (order: PaymentOrder) => void,
): ColumnDef<PaymentOrder>[] {
  return [
    {
      key: "id",
      label: "Commande",
      sortable: false,
      render: (order) => (
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
            style={{
              background:
                order.status === "PAID"
                  ? "oklch(0.95 0.018 155)"
                  : order.status === "PENDING"
                    ? "oklch(0.95 0.03 80)"
                    : "oklch(0.96 0.025 20)",
            }}
          >
            {order.status === "PAID" ? (
              <CheckCircle2
                className="h-4 w-4"
                style={{ color: "oklch(0.58 0.16 155)" }}
              />
            ) : order.status === "PENDING" ? (
              <Loader2
                className="h-4 w-4 animate-spin"
                style={{ color: "oklch(0.62 0.16 80)" }}
              />
            ) : (
              <XCircle
                className="h-4 w-4"
                style={{ color: "oklch(0.58 0.16 20)" }}
              />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              #{order.id.slice(-6).toUpperCase()}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: false,
      render: (order) => (
        <span className="text-sm text-foreground">
          {order.type === "SUBSCRIPTION"
            ? "Abonnement"
            : order.type === "SESSION"
              ? "Session"
              : "Ressource"}
        </span>
      ),
    },
    {
      key: "amount",
      label: "Montant",
      sortable: true,
      render: (order) => (
        <span className="text-sm font-medium text-foreground">
          {formatCurrency(order.amount / 100)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (order) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
            order.status === "PAID"
              ? "bg-green-100 text-green-700"
              : order.status === "PENDING"
                ? "bg-yellow-100 text-yellow-700"
                : order.status === "REFUNDED"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-red-100 text-red-700"
          }`}
        >
          {ORDER_STATUS_LABELS[order.status] || order.status}
        </span>
      ),
    },
    {
      key: "id",
      label: "Actions",
      sortable: false,
      render: (order) => (
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
              onClick={() => onView(order)}
            >
              <Eye className="h-3.5 w-3.5" />
              Voir les détails
            </DropdownMenuItem>
            {order.status === "PAID" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 text-xs text-blue-600 focus:text-blue-600 focus:bg-blue-50"
                  onClick={() => onRefund(order)}
                >
                  <RefreshCcw className="h-3.5 w-3.5" />
                  Rembourser
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}

const filters = [
  {
    key: "paymentStatus",
    label: "Paiement",
    options: [
      { label: "Payé", value: "paid" },
      { label: "En attente", value: "pending" },
      { label: "En retard", value: "overdue" },
      { label: "Non payé", value: "unpaid" },
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

const orderFilters = [
  {
    key: "status",
    label: "Statut",
    options: [
      { label: "Payé", value: "PAID" },
      { label: "En attente", value: "PENDING" },
      { label: "Échoué", value: "FAILED" },
      { label: "Remboursé", value: "REFUNDED" },
      { label: "Annulé", value: "CANCELLED" },
    ],
  },
];

export default function SubscriptionsPage() {
  const { data: parentsData = [], isLoading: parentsLoading } = useParents();
  const { data: ordersData = [], isLoading: ordersLoading } = useOrders({
    limit: 100,
  });
  const refundMutation = useRefundOrder();

  const [viewParent, setViewParent] = useState<Parent | null>(null);
  const [viewOrder, setViewOrder] = useState<PaymentOrder | null>(null);
  const [refundOrder, setRefundOrder] = useState<PaymentOrder | null>(null);

  const parents = parentsData.map(adaptParent);
  const orders = ordersData;

  const subscriptionColumns = buildSubscriptionColumns(setViewParent);
  const orderColumns = buildOrderColumns(setViewOrder, setRefundOrder);

  const handleRefund = async () => {
    if (!refundOrder) return;
    await refundMutation.mutateAsync(refundOrder.id);
    setRefundOrder(null);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background px-4 md:px-6">
        <div>
          <h1 className="flex items-center gap-2 text-base font-semibold text-foreground tracking-tight">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            Abonnements
          </h1>
          <p className="text-xs text-muted-foreground">
            Gérer les abonnements et les paiements des parents
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="subscriptions" className="h-full">
          <TabsList
            variant="line"
            className="w-full justify-start border-b border-border/60 rounded-none pb-0 h-auto bg-background px-6"
          >
            <TabsTrigger value="subscriptions" className="gap-1.5 pb-3">
              <ShieldCheck className="h-4 w-4" />
              Abonnements
              <span
                className="rounded-full px-1.5 py-0 text-[10px] font-semibold"
                style={{
                  background: "oklch(0.94 0.008 80)",
                  color: "oklch(0.48 0.02 250)",
                }}
              >
                {parents.filter((p) => p.planId).length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-1.5 pb-3">
              <Receipt className="h-4 w-4" />
              Commandes
              <span
                className="rounded-full px-1.5 py-0 text-[10px] font-semibold"
                style={{
                  background: "oklch(0.95 0.018 155)",
                  color: "oklch(0.38 0.12 155)",
                }}
              >
                {orders.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions" className="p-4 md:p-6">
            {parentsLoading ? (
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
                columns={subscriptionColumns}
                filters={filters}
                searchKeys={["name", "email"]}
                itemsPerPage={10}
                onRowClick={setViewParent}
              />
            )}
          </TabsContent>

          <TabsContent value="orders" className="p-4 md:p-6">
            {ordersLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : orders.length === 0 ? (
              <EmptyState
                title="Aucune commande"
                description="Aucune commande n'a été trouvée."
              />
            ) : (
              <DataTable
                data={orders}
                columns={orderColumns}
                filters={orderFilters}
                searchKeys={["id"]}
                itemsPerPage={10}
                onRowClick={setViewOrder}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Modal
        open={!!viewParent}
        onOpenChange={(open) => !open && setViewParent(null)}
        type="details"
        title="Détails de l'abonnement"
        description="Informations sur l'abonnement du parent."
        size="md"
        icon={null}
        actions={{
          secondary: {
            label: "Fermer",
            onClick: () => setViewParent(null),
            variant: "outline",
          },
        }}
      >
        {viewParent && <SubscriptionQuickView parentId={viewParent.id} />}
      </Modal>

      <Modal
        open={!!viewOrder}
        onOpenChange={(open) => !open && setViewOrder(null)}
        type="details"
        title="Détails de la commande"
        description="Informations sur la commande."
        size="sm"
        icon={null}
        actions={{
          secondary: {
            label: "Fermer",
            onClick: () => setViewOrder(null),
            variant: "outline",
          },
        }}
      >
        {viewOrder && <OrderQuickView order={viewOrder} />}
      </Modal>

      <Modal
        open={!!refundOrder}
        onOpenChange={(open) => !open && setRefundOrder(null)}
        type="form"
        title="Rembourser la commande"
        description={`Êtes-vous sûr de vouloir rembourser cette commande de ${refundOrder ? formatCurrency(refundOrder.amount / 100) : ""}?`}
        size="sm"
        actions={{
          primary: {
            label: refundMutation.isPending
              ? "Remboursement..."
              : "Confirmer le remboursement",
            onClick: handleRefund,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setRefundOrder(null),
            variant: "outline",
          },
        }}
      >
        <p className="text-sm text-muted-foreground">
          Cette action est irréversible. Le montant sera crédité au client.
        </p>
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
