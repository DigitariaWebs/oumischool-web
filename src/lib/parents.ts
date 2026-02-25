import type { AdminParent } from "@/hooks/parents/api";
import type { Parent, ParentStatus, PlanId } from "@/types";

export const PLAN_META: Record<
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

export function getPlanMeta(planId?: PlanId) {
  return planId ? PLAN_META[planId] : undefined;
}

export function normalizePlanId(name?: string | null): PlanId | undefined {
  if (!name) return undefined;
  const slug = name.toLowerCase().trim() as PlanId;
  return slug in PLAN_META ? slug : undefined;
}

export function calculateAge(dateOfBirth: string | null): number {
  if (!dateOfBirth) return 0;
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function adaptParent(parent: AdminParent): Parent {
  const normalizedStatus = String(parent.user?.status ?? "").toUpperCase();
  const status: ParentStatus =
    normalizedStatus === "ACTIVE"
      ? "active"
      : normalizedStatus === "SUSPENDED"
        ? "suspended"
        : "inactive";
  const planId = normalizePlanId(parent.subscription?.plan?.name);

  return {
    id: parent.id,
    name: `${parent.firstName} ${parent.lastName}`.trim(),
    email: parent.user.email,
    phone: "—" as const,
    location: "—" as const,
    status,
    children: parent.children.map((child) => ({
      name: child.name,
      grade: child.grade,
      age: calculateAge(child.dateOfBirth),
      studentId: child.id,
    })),
    paymentStatus: parent.paymentStatus,
    joinedDate: new Date(parent.user.createdAt).toLocaleDateString("fr-FR", {
      month: "short",
      year: "numeric",
    }),
    planId,
    notes: parent.notes ?? "",
    totalPayments: parent.totalPayments,
    monthlyFee: parent.monthlyFee ?? undefined,
  };
}

export function getParentInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
