import { resolveDashboardUiState } from "./dashboard-state";
import { describe, expect, test } from "bun:test";

describe("resolveDashboardUiState", () => {
  test("returns loading", () => {
    expect(
      resolveDashboardUiState({
        isLoading: true,
        isError: false,
        schedule: [],
      }),
    ).toBe("loading");
  });

  test("returns error", () => {
    expect(
      resolveDashboardUiState({
        isLoading: false,
        isError: true,
        schedule: [],
      }),
    ).toBe("error");
  });

  test("returns empty", () => {
    expect(
      resolveDashboardUiState({
        isLoading: false,
        isError: false,
        schedule: [],
      }),
    ).toBe("empty");
  });

  test("returns ready", () => {
    expect(
      resolveDashboardUiState({
        isLoading: false,
        isError: false,
        schedule: [
          {
            id: "1",
            source: "session",
            title: "Math",
            subject: "Math",
            startTime: "2026-04-10T10:00:00.000Z",
            endTime: "2026-04-10T10:20:00.000Z",
            status: "SCHEDULED",
          },
        ],
      }),
    ).toBe("ready");
  });
});
