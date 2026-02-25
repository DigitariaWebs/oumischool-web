import { api, asList, PaginatedListResponse } from "@/lib/api-client";

export interface AdminParentUser {
  id: string;
  email: string;
  status: string;
  createdAt: string;
}

export interface AdminParentChild {
  id: string;
  name: string;
  grade: string;
  dateOfBirth: string | null;
}

export interface AdminParent {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  notes: string | null;
  user: AdminParentUser;
  children: AdminParentChild[];
  subscription: {
    planId: string;
    plan: { name: string; price: number } | null;
  } | null;
  planId: string | null;
  monthlyFee: number | null;
  paymentStatus: "paid" | "pending" | "overdue" | "unpaid";
  totalPayments: number;
}

export interface CreateAdminParentPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string;
}

export interface AdminOrder {
  id: string;
  type: string; // RESOURCE | SESSION | SUBSCRIPTION
  status: string; // PENDING | PAID | FAILED | REFUNDED | CANCELLED
  amount: number; // in cents
  currency: string;
  createdAt: string;
  items: Array<{
    id: string;
    description: string;
    unitAmount: number;
    quantity: number;
  }>;
}

export const parentsApi = {
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
      AdminParent[] | PaginatedListResponse<AdminParent>
    >(`/admin/parents${qs}`);
    return asList<AdminParent>(res);
  },
  detail: (id: string) => api.get<AdminParent>(`/admin/parents/${id}`),
  activate: (id: string) => api.post<unknown>(`/admin/parents/${id}/activate`),
  suspend: (id: string) => api.post<unknown>(`/admin/parents/${id}/suspend`),
  deactivate: (id: string) =>
    api.post<unknown>(`/admin/parents/${id}/deactivate`),
  create: (body: CreateAdminParentPayload) =>
    api.post<AdminParent>("/admin/parents", body),
  listOrders: (parentId: string) =>
    api.get<AdminOrder[]>(`/payments/orders?parentId=${parentId}`),
};
