export const settingsKeys = {
  all: ["settings"] as const,
  commission: () => [...settingsKeys.all, "commission"] as const,
  plans: () => [...settingsKeys.all, "plans"] as const,
};
