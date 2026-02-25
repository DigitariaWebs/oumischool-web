"use client";

import { paymentsApi } from "./api";
import { paymentsKeys } from "./keys";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useOrders(params?: {
  parentId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: [
      ...paymentsKeys.orders(),
      params?.parentId,
      params?.status,
      params?.page,
      params?.limit,
    ],
    queryFn: () => paymentsApi.listOrders(params),
  });
}

export function useRefundOrder() {
  return useMutation({
    mutationFn: (orderId: string) => paymentsApi.refundOrder(orderId),
  });
}

export function useTutorPayouts(tutorId: string) {
  return useQuery({
    queryKey: paymentsKeys.tutorPayouts(tutorId),
    queryFn: () => paymentsApi.getTutorPayouts(tutorId),
    enabled: !!tutorId,
  });
}

export function useTutorRevenue(tutorId: string) {
  return useQuery({
    queryKey: [...paymentsKeys.payouts(tutorId), "revenue"],
    queryFn: () => paymentsApi.getTutorRevenue(tutorId),
    enabled: !!tutorId,
  });
}

export function useTutorsWithPendingPayouts() {
  return useQuery({
    queryKey: [...paymentsKeys.all, "tutors-pending-payouts"],
    queryFn: () => paymentsApi.getTutorsWithPendingPayouts(),
  });
}

export function useCreatePayout() {
  return useMutation({
    mutationFn: ({
      tutorId,
      payload,
    }: {
      tutorId: string;
      payload: {
        amount: number;
        method: string;
        reference?: string;
        status: "RECORDED" | "PAID" | "FAILED";
      };
    }) => paymentsApi.createPayout(tutorId, payload),
  });
}
