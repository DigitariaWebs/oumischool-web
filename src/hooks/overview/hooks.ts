"use client";

import { overviewApi } from "./api";
import { overviewKeys } from "./keys";
import { useQuery } from "@tanstack/react-query";

export function useOverviewMetrics() {
  return useQuery({
    queryKey: overviewKeys.metrics(),
    queryFn: overviewApi.getMetrics,
  });
}

export function useRevenueSummary() {
  return useQuery({
    queryKey: overviewKeys.revenueSummary(),
    queryFn: overviewApi.getRevenueSummary,
  });
}
