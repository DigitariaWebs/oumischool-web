export const resourceKeys = {
  all: ["resources"] as const,
  lists: () => [...resourceKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...resourceKeys.lists(), params] as const,
  detail: (id: string) => [...resourceKeys.all, "detail", id] as const,
};
