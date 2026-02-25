"use client";

import { revenueApi } from "./api";
import { revenueKeys } from "./keys";
import { useQuery } from "@tanstack/react-query";

export function useAdminRevenueSummary() {
  return useQuery({
    queryKey: revenueKeys.adminSummary(),
    queryFn: revenueApi.getAdminSummary,
  });
}

export function useAdminTutorRevenue(tutorId: string) {
  return useQuery({
    queryKey: revenueKeys.tutorRevenue(tutorId),
    queryFn: () => revenueApi.getTutorRevenue(tutorId),
    enabled: !!tutorId,
  });
}

export function useAdminTutorRevenueBreakdown(tutorId: string) {
  return useQuery({
    queryKey: revenueKeys.tutorBreakdown(tutorId),
    queryFn: () => revenueApi.getTutorRevenueBreakdown(tutorId),
    enabled: !!tutorId,
  });
}
