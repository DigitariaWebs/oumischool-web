"use client";

import { tutorsApi, CreateAdminTutorPayload } from "./api";
import { tutorKeys } from "./keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTutors(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: tutorKeys.list(params),
    queryFn: () => tutorsApi.list(params),
  });
}

export function usePendingTutors(params?: {
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: tutorKeys.pending(params),
    queryFn: () => tutorsApi.pending(params),
  });
}

export function useTutorDetail(id: string) {
  return useQuery({
    queryKey: tutorKeys.detail(id),
    queryFn: () => tutorsApi.detail(id),
    enabled: !!id,
  });
}

export function useTutorLessons(id: string) {
  return useQuery({
    queryKey: tutorKeys.lessons(id),
    queryFn: () => tutorsApi.lessons(id),
    enabled: !!id,
  });
}

export function useTutorReviews(id: string) {
  return useQuery({
    queryKey: tutorKeys.reviews(id),
    queryFn: () => tutorsApi.reviews(id),
    enabled: !!id,
  });
}

export function useTutorRevenue(id: string) {
  return useQuery({
    queryKey: tutorKeys.revenue(id),
    queryFn: () => tutorsApi.revenue(id),
    enabled: !!id,
  });
}

export function useTutorRevenueBreakdown(id: string) {
  return useQuery({
    queryKey: tutorKeys.revenueBreakdown(id),
    queryFn: () => tutorsApi.revenueBreakdown(id),
    enabled: !!id,
  });
}

export function useApproveTutor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tutorsApi.approve(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tutorKeys.all });
    },
  });
}

export function useRejectTutor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tutorsApi.reject(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tutorKeys.all });
    },
  });
}

export function useDeactivateTutor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tutorsApi.deactivate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tutorKeys.all });
    },
  });
}

export function useCreateTutor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateAdminTutorPayload) => tutorsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tutorKeys.all });
    },
  });
}
