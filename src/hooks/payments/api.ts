import { api, asList, PaginatedListResponse } from "@/lib/api-client";

export interface PaymentOrder {
  id: string;
  parentId: string;
  parentName?: string;
  parentEmail?: string;
  type: "RESOURCE" | "SESSION" | "SUBSCRIPTION";
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "CANCELLED";
  amount: number;
  currency: string;
  createdAt: string;
  updatedAt?: string;
  items: Array<{
    id: string;
    description: string;
    unitAmount: number;
    quantity: number;
  }>;
}

export interface TutorPayout {
  id: string;
  tutorId: string;
  tutorName?: string;
  amount: number;
  method: string | null;
  reference: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  paidAt: string | null;
  status: "RECORDED" | "PAID" | "FAILED";
  createdAt: string;
}

export interface TutorPendingPayout {
  tutorId: string;
  tutorName: string;
  email: string;
  totalEarnings: number;
  totalPaid: number;
  pendingAmount: number;
}

export interface TutorWithRevenue {
  tutorId: string;
  tutorName: string;
  email: string;
  totalEarnings: number;
  totalPaid: number;
  pendingAmount: number;
}

export const paymentsApi = {
  listOrders: async (params?: {
    parentId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.parentId) query.set("parentId", params.parentId);
    if (params?.status) query.set("status", params.status);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString() ? `?${query.toString()}` : "";
    const res = await api.get<
      PaymentOrder[] | PaginatedListResponse<PaymentOrder>
    >(`/payments/orders${qs}`);
    return asList<PaymentOrder>(res);
  },

  refundOrder: (orderId: string) =>
    api.post<{ success: boolean }>(`/payments/orders/${orderId}/refund`),

  getTutorPayouts: async (tutorId: string) => {
    const res = await api.get<
      TutorPayout[] | PaginatedListResponse<TutorPayout>
    >(`/revenue/admin/tutors/${tutorId}/payouts`);
    return asList<TutorPayout>(res);
  },

  getTutorRevenue: (tutorId: string) =>
    api.get<{ total: number }>(`/revenue/admin/tutors/${tutorId}`),

  getTutorsWithPendingPayouts: async () => {
    const res = await api.get<
      TutorPendingPayout[] | PaginatedListResponse<TutorPendingPayout>
    >("/revenue/admin/tutors/pending-payouts");
    return asList<TutorPendingPayout>(res);
  },

  createPayout: (
    tutorId: string,
    payload: {
      amount: number;
      method: string;
      reference?: string;
      status: "RECORDED" | "PAID" | "FAILED";
    },
  ) =>
    api.post<TutorPayout>(`/revenue/admin/tutors/${tutorId}/payouts`, payload),
};
