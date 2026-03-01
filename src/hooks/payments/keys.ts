export const paymentsKeys = {
  all: ["payments"] as const,
  allOrders: () => [...paymentsKeys.all, "all-orders"] as const,
  orders: () => [...paymentsKeys.all, "orders"] as const,
  ordersByParent: (parentId: string) =>
    [...paymentsKeys.orders(), "parent", parentId] as const,
  payouts: () => [...paymentsKeys.all, "payouts"] as const,
};
