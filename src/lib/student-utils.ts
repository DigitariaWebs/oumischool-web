import { AppRole, getHomeRouteByRole, mapBackendRole } from "@/lib/auth-role";

export type StudentViewMode = "day" | "week";

export interface StudentScheduleItem {
  id: string;
  source: "session" | "self_directed";
  title: string;
  subject: string;
  subjectColor?: string | null;
  startTime: string;
  endTime: string;
  status: string;
  meetingLink?: string | null;
}

export interface StudentBadgeSet {
  attendance70: boolean;
  score60: boolean;
  score85: boolean;
  activities5: boolean;
}

export function computeDurationMinutes(
  startTime: string,
  endTime: string,
): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const diff = Math.round((end - start) / 60000);
  return Math.max(1, Number.isFinite(diff) ? diff : 1);
}

export function shouldExcludeSession(
  status: string | null | undefined,
): boolean {
  const normalized = String(status ?? "").toUpperCase();
  return normalized === "CANCELLED" || normalized === "REJECTED";
}

export function toRoleRoute(role: string | null | undefined): string {
  return getHomeRouteByRole(mapBackendRole(role));
}

export function getNextLesson(
  items: StudentScheduleItem[],
  now = new Date(),
): StudentScheduleItem | null {
  const nowMs = now.getTime();
  const future = items
    .filter((item) => !shouldExcludeSession(item.status))
    .filter((item) => new Date(item.startTime).getTime() >= nowMs)
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );
  return future[0] ?? null;
}

export function mergeScheduleItems(
  sessions: StudentScheduleItem[],
  events: StudentScheduleItem[],
): StudentScheduleItem[] {
  return [...sessions, ...events]
    .filter((item) => !shouldExcludeSession(item.status))
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );
}

function startOfWeek(date: Date): Date {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function endOfWeek(date: Date): Date {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function filterScheduleItemsByView(
  items: StudentScheduleItem[],
  selectedDate: Date,
  mode: StudentViewMode,
): StudentScheduleItem[] {
  if (mode === "day") {
    const dayStart = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(selectedDate);
    dayEnd.setHours(23, 59, 59, 999);

    return items.filter((item) => {
      const start = new Date(item.startTime);
      return start >= dayStart && start <= dayEnd;
    });
  }

  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);

  return items.filter((item) => {
    const start = new Date(item.startTime);
    return start >= weekStart && start <= weekEnd;
  });
}

export function computeBadges(input: {
  attendanceRate: number;
  avgScore: number;
  activitiesCount: number;
}): StudentBadgeSet {
  return {
    attendance70: input.attendanceRate >= 70,
    score60: input.avgScore >= 60,
    score85: input.avgScore >= 85,
    activities5: input.activitiesCount >= 5,
  };
}

export function getSubjectColor(
  subjectColor: string | null | undefined,
): string {
  if (subjectColor && subjectColor.trim().length > 0) return subjectColor;
  return "oklch(0.58 0.16 155)";
}

export function isRoleAllowed(role: AppRole, allowed: AppRole[]): boolean {
  return allowed.includes(role);
}
