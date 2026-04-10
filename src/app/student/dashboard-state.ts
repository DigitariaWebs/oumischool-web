import { StudentScheduleItem } from "@/lib/student-utils";

export type DashboardUiState = "loading" | "error" | "empty" | "ready";

export function resolveDashboardUiState(input: {
  isLoading: boolean;
  isError: boolean;
  schedule: StudentScheduleItem[];
}): DashboardUiState {
  if (input.isLoading) return "loading";
  if (input.isError) return "error";
  if (input.schedule.length === 0) return "empty";
  return "ready";
}
