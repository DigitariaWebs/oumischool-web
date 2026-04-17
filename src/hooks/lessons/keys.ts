import type { ListLessonsFilters } from "./api";

export const lessonKeys = {
  all: ["lessons"] as const,
  lists: () => [...lessonKeys.all, "list"] as const,
  list: (filters?: ListLessonsFilters) =>
    [...lessonKeys.lists(), filters ?? {}] as const,
  details: () => [...lessonKeys.all, "detail"] as const,
  detail: (id: string) => [...lessonKeys.details(), id] as const,
};
