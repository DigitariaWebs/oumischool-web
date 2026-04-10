import { api } from "@/lib/api-client";

export interface StudentSession {
  id: string;
  title: string;
  subject?: { id?: string; name?: string; color?: string } | null;
  subjectName?: string;
  startTime: string;
  endTime: string;
  status: string;
  mode?: string | null;
  meetingLink?: string | null;
  tutor?: { firstName?: string; lastName?: string; name?: string } | null;
  price?: number | null;
}

export interface StudentCalendarEvent {
  id: string;
  title: string;
  description?: string | null;
  subject?: { id?: string; name?: string; color?: string } | null;
  startTime: string;
  endTime: string;
  status?: string | null;
  type?: string;
  resources?: StudentResource[];
}

export interface StudentLesson {
  id: string;
  title: string;
  description?: string | null;
  subject?: { id?: string; name?: string; color?: string } | null;
  startTime: string;
  endTime: string;
  meetingLink?: string | null;
  sessionId?: string;
}

export interface StudentResource {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  subject?: string | null;
  grade?: string | null;
  fileUrl?: string | null;
  isGame?: boolean;
  hasEntitlement?: boolean;
  tags?: string[];
}

export interface StudentPerformance {
  avgScore: number;
  attendanceRate: number;
  subjectProgress?: { subject: string; score: number }[];
}

export interface StudentActivity {
  id: string;
  type: string;
  subject?: string;
  createdAt: string;
  score?: number;
  title?: string;
  description?: string;
  status?: string;
}

export interface StudentRecommendation {
  id: string;
  type: string;
  title: string;
  description?: string;
}

function asArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object" && "data" in value) {
    const nested = (value as { data?: unknown }).data;
    if (Array.isArray(nested)) return nested as T[];
  }
  return [];
}

function pickSession(raw: Record<string, unknown>): StudentSession {
  return {
    id: String(raw.id ?? ""),
    title: String(raw.title ?? raw.name ?? "Session"),
    subject: (raw.subject as StudentSession["subject"]) ?? null,
    subjectName: String(raw.subjectName ?? ""),
    startTime: String(raw.startTime ?? raw.start ?? new Date().toISOString()),
    endTime: String(raw.endTime ?? raw.end ?? new Date().toISOString()),
    status: String(raw.status ?? "SCHEDULED"),
    mode: (raw.mode as string | null) ?? null,
    meetingLink: (raw.meetingLink as string | null) ?? null,
    tutor: (raw.tutor as StudentSession["tutor"]) ?? null,
    price: typeof raw.price === "number" ? raw.price : null,
  };
}

function pickResource(raw: Record<string, unknown>): StudentResource {
  return {
    id: String(raw.id ?? ""),
    title: String(raw.title ?? "Ressource"),
    description: (raw.description as string | null) ?? null,
    type: String(raw.type ?? "other"),
    subject: (raw.subject as string | null) ?? null,
    grade: (raw.grade as string | null) ?? null,
    fileUrl: (raw.fileUrl as string | null) ?? null,
    isGame: Boolean(raw.isGame),
    hasEntitlement: Boolean(raw.hasEntitlement),
    tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
  };
}

export const studentApi = {
  sessions: async () => {
    const res = await api.get<unknown>("/sessions");
    return asArray<Record<string, unknown>>(res).map(pickSession);
  },
  sessionDetail: async (id: string) => {
    const res = await api.get<Record<string, unknown>>(`/sessions/${id}`);
    return pickSession(res);
  },
  calendarEvents: async () => {
    const res = await api.get<unknown>("/calendar/events");
    return asArray<Record<string, unknown>>(res).map((raw) => ({
      id: String(raw.id ?? ""),
      title: String(raw.title ?? "Événement"),
      description: (raw.description as string | null) ?? null,
      subject: (raw.subject as StudentCalendarEvent["subject"]) ?? null,
      startTime: String(raw.startTime ?? raw.start ?? new Date().toISOString()),
      endTime: String(raw.endTime ?? raw.end ?? new Date().toISOString()),
      status: (raw.status as string | null) ?? "SCHEDULED",
      type: String(raw.type ?? "self_directed"),
      resources: asArray<Record<string, unknown>>(raw.resources).map(
        pickResource,
      ),
    }));
  },
  calendarEventDetail: async (id: string) => {
    const raw = await api.get<Record<string, unknown>>(
      `/calendar/events/${id}`,
    );
    return {
      id: String(raw.id ?? ""),
      title: String(raw.title ?? "Événement"),
      description: (raw.description as string | null) ?? null,
      subject: (raw.subject as StudentCalendarEvent["subject"]) ?? null,
      startTime: String(raw.startTime ?? raw.start ?? new Date().toISOString()),
      endTime: String(raw.endTime ?? raw.end ?? new Date().toISOString()),
      status: (raw.status as string | null) ?? "SCHEDULED",
      type: String(raw.type ?? "self_directed"),
      resources: asArray<Record<string, unknown>>(raw.resources).map(
        pickResource,
      ),
    } as StudentCalendarEvent;
  },
  markCalendarEventDone: (id: string) =>
    api.put<{ success: boolean }>(`/calendar/events/${id}`, {
      status: "COMPLETED",
    }),
  assignedLessons: async () => {
    const res = await api.get<unknown>("/lessons/assigned");
    return asArray<Record<string, unknown>>(res).map((raw) => ({
      id: String(raw.id ?? ""),
      title: String(raw.title ?? "Leçon"),
      description: (raw.description as string | null) ?? null,
      subject: (raw.subject as StudentLesson["subject"]) ?? null,
      startTime: String(raw.startTime ?? raw.start ?? new Date().toISOString()),
      endTime: String(raw.endTime ?? raw.end ?? new Date().toISOString()),
      meetingLink: (raw.meetingLink as string | null) ?? null,
      sessionId: (raw.sessionId as string | undefined) ?? undefined,
    }));
  },
  resources: async () => {
    const res = await api.get<unknown>("/resources");
    return asArray<Record<string, unknown>>(res).map(pickResource);
  },
  resourceDownload: (id: string) =>
    api.post<{ url?: string; fileUrl?: string } & StudentResource>(
      `/resources/${id}/download`,
      {},
    ),
  resourceRecordView: (id: string) =>
    api.post<{ ok: boolean }>(`/resources/${id}/record-view`, {}),
  performance: (childId: string) =>
    api.get<StudentPerformance>(`/children/${childId}/performance`),
  activities: async (childId: string, limit = 10) =>
    api.get<StudentActivity[]>(
      `/children/${childId}/activities?limit=${limit}`,
    ),
  recommendations: (childId: string) =>
    api.get<StudentRecommendation[]>(`/children/${childId}/recommendations`),
  createActivity: (childId: string, body: Record<string, unknown>) =>
    api.post<{ success: boolean }>(`/children/${childId}/activities`, body),
};
