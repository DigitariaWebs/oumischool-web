"use client";

import { settingsApi, CreatePlanInput, UpdatePlanInput } from "./api";
import { settingsKeys } from "./keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCommission() {
  return useQuery({
    queryKey: settingsKeys.commission(),
    queryFn: settingsApi.getCommission,
  });
}

export function useUpdateCommission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pct: number) => settingsApi.updateCommission(pct),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.commission() });
    },
  });
}

export function usePlans() {
  return useQuery({
    queryKey: settingsKeys.plans(),
    queryFn: settingsApi.getPlans,
  });
}

export function useCreatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePlanInput) => settingsApi.createPlan(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.plans() });
    },
  });
}

export function useUpdatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlanInput }) =>
      settingsApi.updatePlan(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.plans() });
    },
  });
}

export function useDeletePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsApi.deletePlan(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.plans() });
    },
  });
}

export function useReactivatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsApi.reactivatePlan(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.plans() });
    },
  });
}
