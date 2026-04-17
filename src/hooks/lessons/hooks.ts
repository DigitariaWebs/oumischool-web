"use client";

import {
  CreateLessonPayload,
  ListLessonsFilters,
  UpdateLessonPayload,
  lessonsApi,
} from "./api";
import { lessonKeys } from "./keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useLessons(filters?: ListLessonsFilters) {
  return useQuery({
    queryKey: lessonKeys.list(filters),
    queryFn: () => lessonsApi.list(filters),
  });
}

export function useLesson(id: string | undefined) {
  return useQuery({
    queryKey: lessonKeys.detail(id ?? ""),
    queryFn: () => lessonsApi.detail(id!),
    enabled: !!id,
  });
}

export function useCreateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateLessonPayload) => lessonsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: lessonKeys.all });
    },
  });
}

export function useUpdateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & UpdateLessonPayload) =>
      lessonsApi.update(id, body),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: lessonKeys.detail(id) });
      qc.invalidateQueries({ queryKey: lessonKeys.lists() });
    },
  });
}

export function useDeleteLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => lessonsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: lessonKeys.all });
    },
  });
}
