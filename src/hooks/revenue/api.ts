import { api } from "@/lib/api-client";

export interface AdminRevenueSummary {
  totalGross: number;
  totalCommission: number;
  totalNet: number;
}

export interface TutorRevenueForAdmin {
  total: number;
  bySubject: {
    subjectId: string;
    amount: number;
    standaloneAmount: number;
    series: unknown[];
    standaloneLessons: unknown[];
  }[];
  recurringSessions?: unknown[];
}

export const revenueApi = {
  getAdminSummary: () => api.get<AdminRevenueSummary>("/revenue/admin/summary"),
  getTutorRevenue: (tutorId: string) =>
    api.get<TutorRevenueForAdmin>(`/revenue/admin/tutors/${tutorId}`),
  getTutorRevenueBreakdown: (tutorId: string) =>
    api.get<unknown>(`/revenue/admin/tutors/${tutorId}/breakdown`),
};
