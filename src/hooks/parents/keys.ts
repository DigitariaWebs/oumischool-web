export const parentKeys = {
  all: ["parents"] as const,
  lists: () => [...parentKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...parentKeys.lists(), params] as const,
  details: () => [...parentKeys.all, "detail"] as const,
  detail: (id: string) => [...parentKeys.details(), id] as const,
};
