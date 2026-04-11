"use client";

import { studentApi } from "./api";
import { studentKeys } from "./keys";
import { useStudentChildId } from "@/hooks/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useStudentSessions() {
  return useQuery({
    queryKey: studentKeys.sessions(),
    queryFn: studentApi.sessions,
  });
}

export function useStudentSessionDetail(id: string) {
  return useQuery({
    queryKey: studentKeys.sessionDetail(id),
    queryFn: () => studentApi.sessionDetail(id),
    enabled: !!id,
  });
}

export function useStudentCalendarEvents() {
  return useQuery({
    queryKey: studentKeys.events(),
    queryFn: studentApi.calendarEvents,
  });
}

export function useStudentCalendarEventDetail(id: string) {
  return useQuery({
    queryKey: studentKeys.eventDetail(id),
    queryFn: () => studentApi.calendarEventDetail(id),
    enabled: !!id,
  });
}

export function useMarkStudentCalendarEventDone(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => studentApi.markCalendarEventDone(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: studentKeys.events() });
      qc.invalidateQueries({ queryKey: studentKeys.eventDetail(id) });
    },
  });
}

export function useStartStudentCalendarEvent(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => studentApi.startCalendarEvent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: studentKeys.events() });
      qc.invalidateQueries({ queryKey: studentKeys.eventDetail(id) });
    },
  });
}

export function useUpdateStudentCalendarEventProgress(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (progress: number) =>
      studentApi.updateCalendarEventProgress(id, progress),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: studentKeys.events() });
      qc.invalidateQueries({ queryKey: studentKeys.eventDetail(id) });
    },
  });
}

export function useStudentAssignedLessons() {
  return useQuery({
    queryKey: studentKeys.lessons(),
    queryFn: studentApi.assignedLessons,
  });
}

export function useStudentResources() {
  return useQuery({
    queryKey: studentKeys.resources(),
    queryFn: studentApi.resources,
  });
}

export function useStudentDownloadResource() {
  return useMutation({
    mutationFn: (id: string) => studentApi.resourceDownload(id),
  });
}

export function useStudentRecordResourceView() {
  return useMutation({
    mutationFn: (id: string) => studentApi.resourceRecordView(id),
  });
}

export function useStudentPerformance() {
  const childId = useStudentChildId();

  return useQuery({
    queryKey: studentKeys.performance(childId ?? ""),
    queryFn: () => studentApi.performance(childId ?? ""),
    enabled: !!childId,
  });
}

export function useStudentActivities(limit = 10) {
  const childId = useStudentChildId();

  return useQuery({
    queryKey: studentKeys.activities(childId ?? "", limit),
    queryFn: () => studentApi.activities(childId ?? "", limit),
    enabled: !!childId,
  });
}

export function useStudentRecommendations() {
  const childId = useStudentChildId();

  return useQuery({
    queryKey: studentKeys.recommendations(childId ?? ""),
    queryFn: () => studentApi.recommendations(childId ?? ""),
    enabled: !!childId,
  });
}

export function useStudentCreateActivity() {
  const childId = useStudentChildId();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      studentApi.createActivity(childId ?? "", body),
    onSuccess: () => {
      if (childId) {
        qc.invalidateQueries({ queryKey: studentKeys.activities(childId, 10) });
        qc.invalidateQueries({ queryKey: studentKeys.performance(childId) });
      }
    },
  });
}
