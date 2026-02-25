import { api, asList, PaginatedListResponse } from "@/lib/api-client";

export interface AdminStudent {
  id: string;
  name: string;
  grade: string;
  dateOfBirth: string | null;
  deletedAt: string | null;
  parentName: string;
  enrolledSubjects: string[];
  avgScore: number;
  attendanceRate: number;
  parent: {
    id: string;
    firstName: string;
    lastName: string;
    user: { email: string };
  };
}

export interface CreateAdminStudentPayload {
  parentId: string;
  name: string;
  grade: string;
  dateOfBirth?: string;
}

export const studentsApi = {
  list: async (params?: {
    page?: number;
    pageSize?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    else if (params?.pageSize) query.set("limit", String(params.pageSize));
    const qs = query.toString() ? `?${query.toString()}` : "";
    const res = await api.get<
      AdminStudent[] | PaginatedListResponse<AdminStudent>
    >(`/admin/students${qs}`);
    return asList<AdminStudent>(res);
  },
  detail: (id: string) => api.get<AdminStudent>(`/admin/students/${id}`),
  deactivate: (id: string) =>
    api.post<unknown>(`/admin/students/${id}/deactivate`),
  reactivate: (id: string) =>
    api.post<unknown>(`/admin/students/${id}/reactivate`),
  create: (body: CreateAdminStudentPayload) =>
    api.post<AdminStudent>("/admin/students", body),
};
