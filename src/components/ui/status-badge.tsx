import {
  TutorStatus,
  ParentStatus,
  StudentStatus,
  ResourceStatus,
  PaymentStatus,
  StatusStyle,
} from "@/types";

type GeneralStatus =
  | TutorStatus
  | ParentStatus
  | StudentStatus
  | ResourceStatus;

interface StatusBadgeProps {
  status: GeneralStatus;
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

interface BaseStatusBadgeProps {
  status: string;
  label: string;
  statusStyles: Record<string, StatusStyle>;
}

const frenchLabels: Record<GeneralStatus, string> = {
  active: "Actif",
  inactive: "Inactif",
  pending: "En attente",
  suspended: "Suspendu",
  actifs: "Actifs",
  inactifs: "Inactifs",
  graduated: "Diplômé",
  published: "Publié",
  draft: "Brouillon",
  archived: "Archivé",
};

const frenchPaymentLabels: Record<PaymentStatus, string> = {
  paid: "Payé",
  unpaid: "Non payé",
  overdue: "En retard",
  pending: "En attente",
};

const generalStatusStyles: Record<string, StatusStyle> = {
  active: {
    background: "oklch(0.95 0.018 155)",
    color: "oklch(0.38 0.12 155)",
  },
  inactive: {
    background: "oklch(0.94 0.008 80)",
    color: "oklch(0.48 0.02 250)",
  },
  pending: { background: "oklch(0.96 0.03 80)", color: "oklch(0.52 0.14 80)" },
  suspended: {
    background: "oklch(0.96 0.025 20)",
    color: "oklch(0.48 0.16 20)",
  },
  actifs: {
    background: "oklch(0.95 0.018 155)",
    color: "oklch(0.38 0.12 155)",
  },
  inactifs: {
    background: "oklch(0.94 0.008 80)",
    color: "oklch(0.48 0.02 250)",
  },
  graduated: {
    background: "oklch(0.93 0.02 250)",
    color: "oklch(0.42 0.12 250)",
  },
  published: {
    background: "oklch(0.95 0.018 155)",
    color: "oklch(0.38 0.12 155)",
  },
  draft: { background: "oklch(0.96 0.03 80)", color: "oklch(0.52 0.14 80)" },
  archived: {
    background: "oklch(0.94 0.008 80)",
    color: "oklch(0.48 0.02 250)",
  },
};

const paymentStatusStyles: Record<PaymentStatus, StatusStyle> = {
  paid: { background: "oklch(0.95 0.018 155)", color: "oklch(0.38 0.12 155)" },
  unpaid: { background: "oklch(0.96 0.03 80)", color: "oklch(0.52 0.14 80)" },
  overdue: { background: "oklch(0.94 0.008 20)", color: "oklch(0.48 0.02 20)" },
  pending: { background: "oklch(0.96 0.03 80)", color: "oklch(0.52 0.14 80)" },
};

const fallbackStyle: StatusStyle = {
  background: "oklch(0.94 0.008 250)",
  color: "oklch(0.48 0.02 250)",
};

function BaseStatusBadge({
  status,
  label,
  statusStyles,
}: BaseStatusBadgeProps) {
  const style = statusStyles[status] || fallbackStyle;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={style}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: style.color }}
      />
      {label}
    </span>
  );
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <BaseStatusBadge
      status={status}
      label={frenchLabels[status]}
      statusStyles={generalStatusStyles}
    />
  );
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  return (
    <BaseStatusBadge
      status={status}
      label={frenchPaymentLabels[status]}
      statusStyles={paymentStatusStyles}
    />
  );
}
