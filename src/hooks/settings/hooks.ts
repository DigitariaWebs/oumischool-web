"use client";

import { settingsApi } from "./api";
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
