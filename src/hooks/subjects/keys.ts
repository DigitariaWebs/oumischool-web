export const subjectKeys = {
  all: ["subjects"] as const,
  lists: () => [...subjectKeys.all, "list"] as const,
  list: () => [...subjectKeys.lists()] as const,
  details: () => [...subjectKeys.all, "detail"] as const,
  detail: (id: string) => [...subjectKeys.details(), id] as const,
};
