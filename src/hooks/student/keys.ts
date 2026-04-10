export const studentKeys = {
  all: ["student"] as const,
  sessions: () => [...studentKeys.all, "sessions"] as const,
  sessionDetail: (id: string) => [...studentKeys.all, "session", id] as const,
  events: () => [...studentKeys.all, "events"] as const,
  eventDetail: (id: string) => [...studentKeys.all, "event", id] as const,
  lessons: () => [...studentKeys.all, "lessons"] as const,
  resources: () => [...studentKeys.all, "resources"] as const,
  performance: (childId: string) =>
    [...studentKeys.all, "performance", childId] as const,
  activities: (childId: string, limit: number) =>
    [...studentKeys.all, "activities", childId, limit] as const,
  recommendations: (childId: string) =>
    [...studentKeys.all, "recommendations", childId] as const,
};
