export type AppRole = "admin" | "parent" | "tutor" | "child" | "unknown";

export function mapBackendRole(role: string | null | undefined): AppRole {
  const normalized = String(role ?? "").toUpperCase();
  if (normalized === "ADMIN") return "admin";
  if (normalized === "PARENT") return "parent";
  if (normalized === "TUTOR") return "tutor";
  if (normalized === "CHILD" || normalized === "STUDENT") return "child";
  return "unknown";
}

export function getHomeRouteByRole(role: AppRole): string {
  if (role === "child") return "/student";
  if (role === "parent") return "/parent";
  if (role === "tutor") return "/tutor";
  if (role === "admin") return "/dashboard";
  return "/sign-in";
}
