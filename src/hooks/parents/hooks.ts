"use client";

import { parentsApi, CreateAdminParentPayload } from "./api";
import { parentKeys } from "./keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useParents(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: parentKeys.list(params),
    queryFn: () => parentsApi.list(params),
  });
}

export function useParentDetail(id: string) {
  return useQuery({
    queryKey: parentKeys.detail(id),
    queryFn: () => parentsApi.detail(id),
    enabled: !!id,
  });
}

export function useActivateParent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => parentsApi.activate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: parentKeys.all });
    },
  });
}

export function useSuspendParent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => parentsApi.suspend(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: parentKeys.all });
    },
  });
}

export function useDeactivateParent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => parentsApi.deactivate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: parentKeys.all });
    },
  });
}

export function useCreateParent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateAdminParentPayload) => parentsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: parentKeys.all });
    },
  });
}
