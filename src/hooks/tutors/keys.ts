export const tutorKeys = {
  all: ["tutors"] as const,
  lists: () => [...tutorKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...tutorKeys.lists(), params] as const,
  pending: (params?: Record<string, unknown>) =>
    [...tutorKeys.all, "pending", params] as const,
  details: () => [...tutorKeys.all, "detail"] as const,
  detail: (id: string) => [...tutorKeys.details(), id] as const,
  lessons: (id: string) => [...tutorKeys.detail(id), "lessons"] as const,
  reviews: (id: string) => [...tutorKeys.detail(id), "reviews"] as const,
  revenue: (id: string) => [...tutorKeys.detail(id), "revenue"] as const,
  revenueBreakdown: (id: string) =>
    [...tutorKeys.detail(id), "revenue-breakdown"] as const,
};
