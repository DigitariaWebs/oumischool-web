export const revenueKeys = {
  all: ["revenue"] as const,
  adminSummary: () => [...revenueKeys.all, "admin-summary"] as const,
  tutorRevenue: (id: string) =>
    [...revenueKeys.all, "admin-tutor", id] as const,
  tutorBreakdown: (id: string) =>
    [...revenueKeys.all, "admin-tutor", id, "breakdown"] as const,
};
