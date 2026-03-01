"use client";

import { paymentsApi } from "./api";
import { paymentsKeys } from "./keys";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useAllOrders(params?: { parentId?: string }) {
  return useQuery({
    queryKey: [...paymentsKeys.allOrders(), params?.parentId],
    queryFn: () => paymentsApi.listAllOrders(params),
  });
}

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

export function usePayouts() {
  return useQuery({
    queryKey: [...paymentsKeys.all, "payouts"],
    queryFn: () => paymentsApi.listPayouts(),
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
