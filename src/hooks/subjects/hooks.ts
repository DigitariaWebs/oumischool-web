"use client";

import { CreateSubjectPayload, UpdateSubjectPayload, subjectsApi } from "./api";
import { subjectKeys } from "./keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useSubjects() {
  return useQuery({
    queryKey: subjectKeys.list(),
    queryFn: () => subjectsApi.list(),
  });
}

export function useCreateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateSubjectPayload) => subjectsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
}

export function useUpdateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & UpdateSubjectPayload) =>
      subjectsApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
}

export function useDeleteSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subjectsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
}
