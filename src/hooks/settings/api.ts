import { api } from "@/lib/api-client";

export interface CommissionSetting {
  commissionPct: number;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string | null;
  features: string[];
  maxChildren: number | null;
  includesFreeResources: boolean;
  includesPaidResources: boolean;
  maxResourceDownloads: number;
  hasPrioritySupport: boolean;
  hasAdvancedAnalytics: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    subscriptions: number;
  };
}

export interface CreatePlanInput {
  name: string;
  price: number;
  description?: string;
  features: string[];
  maxChildren: number | null;
  includesFreeResources?: boolean;
  includesPaidResources?: boolean;
  maxResourceDownloads?: number;
  hasPrioritySupport?: boolean;
  hasAdvancedAnalytics?: boolean;
}

export interface UpdatePlanInput {
  name?: string;
  price?: number;
  description?: string;
  features?: string[];
  maxChildren?: number | null;
  isActive?: boolean;
  includesFreeResources?: boolean;
  includesPaidResources?: boolean;
  maxResourceDownloads?: number;
  hasPrioritySupport?: boolean;
  hasAdvancedAnalytics?: boolean;
}

export const settingsApi = {
  getCommission: () => api.get<CommissionSetting>("/admin/settings/commission"),
  updateCommission: (commissionPct: number) =>
    api.put<CommissionSetting>("/admin/settings/commission", { commissionPct }),
  getPlans: () => api.get<Plan[]>("/admin/settings/plans"),
  createPlan: (data: CreatePlanInput) =>
    api.post<Plan>("/admin/settings/plans", data),
  updatePlan: (id: string, data: UpdatePlanInput) =>
    api.put<Plan>(`/admin/settings/plans/${id}`, data),
  deletePlan: (id: string) => api.del<void>(`/admin/settings/plans/${id}`),
  reactivatePlan: (id: string) =>
    api.post<Plan>(`/admin/settings/plans/${id}/reactivate`, {}),
};
