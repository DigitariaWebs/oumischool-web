"use client";

import { studentsApi, CreateAdminStudentPayload } from "./api";
import { studentKeys } from "./keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useStudents(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: studentKeys.list(params),
    queryFn: () => studentsApi.list(params),
  });
}

export function useStudentDetail(id: string) {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: () => studentsApi.detail(id),
    enabled: !!id,
  });
}

export function useDeactivateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => studentsApi.deactivate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
}

export function useReactivateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => studentsApi.reactivate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
}

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateAdminStudentPayload) => studentsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
}

export function useStudentSchedule(studentId: string) {
  return useQuery({
    queryKey: studentKeys.detail(studentId).concat(["schedule"]),
    queryFn: () => studentsApi.getSchedule(studentId),
    enabled: !!studentId,
  });
}
