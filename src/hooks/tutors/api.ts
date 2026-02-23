import { api, asList, PaginatedListResponse } from "@/lib/api-client";

export interface AdminTutorUser {
  id: string;
  email: string;
  status: string;
  createdAt: string;
}

export interface AdminTutor {
  id: string;
  userId: string;
  bio: string | null;
  hourlyRate: number;
  subjects: string[];
  languages: string[];
  location: string | null;
  experience: string | null;
  qualifications: string[];
  approvalStatus: string;
  rating: number;
  reviewsCount: number;
  students: number;
  classesThisMonth: number;
  completionRate: number;
  satisfactionRate: number | null;
  responseTimeHours: number | null;
  user: AdminTutorUser;
}

export interface AdminTutorDetail extends AdminTutor {
  revenue: { totalGross: number; totalCommission: number; totalNet: number };
  resources: unknown[];
  sessions: unknown[];
  lessonSeries: unknown[];
  reviews: unknown[];
  availability: unknown[];
}

export interface CreateAdminTutorPayload {
  email: string;
  phone?: string;
  experience?: string;
  password?: string;
}

export interface TutorRevenue {
  total: number;
  bySubject: unknown[];
  recurringSessions?: unknown[];
}

export const tutorsApi = {
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
    const res = await api.get<AdminTutor[] | PaginatedListResponse<AdminTutor>>(
      `/admin/tutors${qs}`,
    );
    return asList<AdminTutor>(res);
  },
  pending: async (params?: {
    page?: number;
    pageSize?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    else if (params?.pageSize) query.set("limit", String(params.pageSize));
    const qs = query.toString() ? `?${query.toString()}` : "";
    const res = await api.get<AdminTutor[] | PaginatedListResponse<AdminTutor>>(
      `/admin/tutors/pending${qs}`,
    );
    return asList<AdminTutor>(res);
  },
  detail: (id: string) => api.get<AdminTutorDetail>(`/admin/tutors/${id}`),
  approve: (id: string) => api.post<AdminTutor>(`/admin/tutors/${id}/approve`),
  reject: (id: string) => api.post<AdminTutor>(`/admin/tutors/${id}/reject`),
  deactivate: (id: string) =>
    api.post<AdminTutor>(`/admin/tutors/${id}/deactivate`),
  create: (body: CreateAdminTutorPayload) =>
    api.post<AdminTutor>("/admin/tutors", body),
  lessons: (id: string) => api.get<unknown[]>(`/tutors/${id}/lessons`),
  reviews: (id: string) => api.get<unknown[]>(`/tutors/${id}/reviews`),
  revenue: (id: string) => api.get<TutorRevenue>(`/revenue/admin/tutors/${id}`),
  revenueBreakdown: (id: string) =>
    api.get<unknown>(`/revenue/admin/tutors/${id}/breakdown`),
};
