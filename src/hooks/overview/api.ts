import { api } from "@/lib/api-client";

export interface OverviewRecentActivity {
  sessionId: string;
  status: string;
  tutorName: string;
  childName: string;
  startTime: string;
  updatedAt: string;
}

export interface OverviewUpcomingClass {
  sessionId: string;
  tutorName: string;
  childName: string;
  subjectId: string | null;
  startTime: string;
  endTime: string;
}

export interface OverviewMetrics {
  users: number;
  approvedTutors: number;
  pendingApprovals: number;
  activeSubscriptions: number;
  sessions: number;
  classesToday: number;
  activeSessions: number;
  satisfactionRate: number | null;
  recentActivity: OverviewRecentActivity[];
  upcomingClasses: OverviewUpcomingClass[];
}

export interface RevenueSummary {
  totalGross: number;
  totalCommission: number;
  totalNet: number;
}

export const overviewApi = {
  getMetrics: () => api.get<OverviewMetrics>("/admin/overview"),
  getRevenueSummary: () => api.get<RevenueSummary>("/revenue/admin/summary"),
};
