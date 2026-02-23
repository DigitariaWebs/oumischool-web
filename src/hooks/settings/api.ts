import { api } from "@/lib/api-client";

export interface CommissionSetting {
  commissionPct: number;
}

export const settingsApi = {
  getCommission: () => api.get<CommissionSetting>("/admin/settings/commission"),
  updateCommission: (commissionPct: number) =>
    api.put<CommissionSetting>("/admin/settings/commission", { commissionPct }),
};
