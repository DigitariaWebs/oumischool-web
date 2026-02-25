export const paymentsKeys = {
  all: ["payments"] as const,
  orders: () => [...paymentsKeys.all, "orders"] as const,
  ordersByParent: (parentId: string) =>
    [...paymentsKeys.orders(), "parent", parentId] as const,
  payouts: (tutorId: string) =>
    [...paymentsKeys.all, "payouts", tutorId] as const,
  tutorPayouts: (tutorId: string) =>
    [...paymentsKeys.payouts(tutorId)] as const,
  tutorPendingPayout: (tutorId: string) =>
    [...paymentsKeys.payouts(tutorId), "pending"] as const,
};
