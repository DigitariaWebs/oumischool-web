"use client";

import {
  resourcesApi,
  CreateResourcePayload,
  UpdateResourcePayload,
} from "./api";
import { resourceKeys } from "./keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useResources() {
  return useQuery({
    queryKey: resourceKeys.list(),
    queryFn: resourcesApi.list,
  });
}

export function useCreateResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateResourcePayload) => resourcesApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: resourceKeys.all });
    },
  });
}

export function useCreateResourceUpload() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) => resourcesApi.createUpload(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: resourceKeys.all });
    },
  });
}

export function useUpdateResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateResourcePayload }) =>
      resourcesApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: resourceKeys.all });
    },
  });
}

export function useArchiveResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resourcesApi.archive(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: resourceKeys.all });
    },
  });
}
