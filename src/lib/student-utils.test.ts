import {
  computeDurationMinutes,
  filterScheduleItemsByView,
  getNextLesson,
  mergeScheduleItems,
  toRoleRoute,
} from "./student-utils";
import { describe, expect, test } from "bun:test";

describe("student-utils", () => {
  const sessions = [
    {
      id: "s1",
      source: "session" as const,
      title: "Math",
      subject: "Math",
      startTime: "2026-04-10T10:00:00.000Z",
      endTime: "2026-04-10T10:45:00.000Z",
      status: "SCHEDULED",
    },
    {
      id: "s2",
      source: "session" as const,
      title: "French",
      subject: "French",
      startTime: "2026-04-11T08:00:00.000Z",
      endTime: "2026-04-11T08:30:00.000Z",
      status: "CANCELLED",
    },
  ];

  const events = [
    {
      id: "e1",
      source: "self_directed" as const,
      title: "Auto",
      subject: "Science",
      startTime: "2026-04-10T09:00:00.000Z",
      endTime: "2026-04-10T09:25:00.000Z",
      status: "SCHEDULED",
    },
  ];

  test("computeDurationMinutes always returns >= 1", () => {
    expect(
      computeDurationMinutes(
        "2026-04-10T10:00:00.000Z",
        "2026-04-10T10:00:00.000Z",
      ),
    ).toBe(1);
  });

  test("mergeScheduleItems excludes cancelled and sorts", () => {
    const merged = mergeScheduleItems(sessions, events);
    expect(merged.length).toBe(2);
    expect(merged[0]?.id).toBe("e1");
    expect(merged[1]?.id).toBe("s1");
  });

  test("getNextLesson returns first future lesson", () => {
    const merged = mergeScheduleItems(sessions, events);
    const next = getNextLesson(merged, new Date("2026-04-10T08:00:00.000Z"));
    expect(next?.id).toBe("e1");
  });

  test("filterScheduleItemsByView supports day mode", () => {
    const merged = mergeScheduleItems(sessions, events);
    const day = filterScheduleItemsByView(
      merged,
      new Date("2026-04-10T12:00:00.000Z"),
      "day",
    );
    expect(day.map((item) => item.id)).toEqual(["e1", "s1"]);
  });

  test("toRoleRoute maps backend role to destination", () => {
    expect(toRoleRoute("CHILD")).toBe("/student");
    expect(toRoleRoute("PARENT")).toBe("/parent");
    expect(toRoleRoute("TUTOR")).toBe("/tutor");
    expect(toRoleRoute("UNKNOWN")).toBe("/sign-in");
  });
});
