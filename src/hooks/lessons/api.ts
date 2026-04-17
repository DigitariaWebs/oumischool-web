import { api } from "@/lib/api-client";

export interface LessonMaterial {
  id: string;
  lessonId: string;
  title: string;
  resourceId: string | null;
  locked: boolean;
}

export interface LessonAuthor {
  id: string;
  email: string;
  role: string;
  parent?: { firstName: string | null; lastName: string | null } | null;
  tutor?: { firstName: string | null; lastName: string | null } | null;
}

export interface Lesson {
  id: string;
  userId: string;
  subjectId: string;
  seriesId: string | null;
  title: string;
  description: string | null;
  grade: string | null;
  orderInSeries: number | null;
  createdAt: string;
  updatedAt: string;
  materials: LessonMaterial[];
  user?: LessonAuthor | null;
  series?: {
    id: string;
    title: string;
    tutorId: string;
  } | null;
}

export interface LessonMaterialInput {
  title: string;
  resourceId?: string;
}

export interface CreateLessonPayload {
  subjectId: string;
  seriesId?: string;
  title: string;
  description?: string;
  grade?: string;
  orderInSeries?: number;
  materials?: LessonMaterialInput[];
}

export type UpdateLessonPayload = Partial<CreateLessonPayload>;

export interface ListLessonsFilters {
  userId?: string;
  seriesId?: string;
  subjectId?: string;
  grade?: string;
}

export const lessonsApi = {
  list: (filters?: ListLessonsFilters) => {
    const params = new URLSearchParams();
    if (filters?.userId) params.set("userId", filters.userId);
    if (filters?.seriesId) params.set("seriesId", filters.seriesId);
    if (filters?.subjectId) params.set("subjectId", filters.subjectId);
    if (filters?.grade) params.set("grade", filters.grade);
    const qs = params.toString();
    return api.get<Lesson[]>(`/lessons${qs ? `?${qs}` : ""}`);
  },
  detail: (id: string) => api.get<Lesson>(`/lessons/${id}`),
  create: (body: CreateLessonPayload) => api.post<Lesson>("/lessons", body),
  update: (id: string, body: UpdateLessonPayload) =>
    api.put<Lesson>(`/lessons/${id}`, body),
  delete: (id: string) => api.del<unknown>(`/lessons/${id}`),
};
