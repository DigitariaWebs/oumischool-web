export const overviewKeys = {
  all: ["overview"] as const,
  metrics: () => [...overviewKeys.all, "metrics"] as const,
  revenueSummary: () => [...overviewKeys.all, "revenue-summary"] as const,
};
