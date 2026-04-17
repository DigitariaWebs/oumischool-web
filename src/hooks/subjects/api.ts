import { api } from "@/lib/api-client";

export interface AdminSubject {
  id: string;
  name: string;
  color: string;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectPayload {
  name: string;
  color: string;
  icon?: string;
}

export interface UpdateSubjectPayload {
  name?: string;
  color?: string;
  icon?: string;
}

export const subjectsApi = {
  list: () => api.get<AdminSubject[]>("/subjects"),
  detail: (id: string) => api.get<AdminSubject>(`/subjects/${id}`),
  create: (body: CreateSubjectPayload) =>
    api.post<AdminSubject>("/subjects", body),
  update: (id: string, body: UpdateSubjectPayload) =>
    api.put<AdminSubject>(`/subjects/${id}`, body),
  delete: (id: string) => api.del<unknown>(`/subjects/${id}`),
};
