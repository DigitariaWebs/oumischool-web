const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token") ?? null;
}

export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") localStorage.setItem("auth_token", token);
}

export function clearAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  isFormData = false,
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isFormData && body !== undefined)
    headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isFormData
      ? (body as FormData)
      : body !== undefined
        ? JSON.stringify(body)
        : undefined,
  });

  const text = await res.text();
  let json: {
    success?: boolean;
    error?: { message?: string };
    data?: T;
  } | null = null;
  if (text) {
    try {
      json = JSON.parse(text) as {
        success?: boolean;
        error?: { message?: string };
        data?: T;
      };
    } catch {
      json = null;
    }
  }
  const hasSuccessEnvelope =
    !!json && typeof json === "object" && "success" in json;

  if (!res.ok || (hasSuccessEnvelope && !json?.success)) {
    throw new ApiError(
      json?.error?.message ?? `Request failed: ${res.status}`,
      res.status,
    );
  }

  if (json && typeof json === "object") {
    if ("data" in json && json.data !== undefined) {
      return json.data as T;
    }
    return json as T;
  }

  return undefined as T;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  del: <T>(path: string) => request<T>("DELETE", path),
  postForm: <T>(path: string, form: FormData) =>
    request<T>("POST", path, form, true),
};

export interface PaginatedListResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function asList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (
    value &&
    typeof value === "object" &&
    "data" in value &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    return (value as { data: T[] }).data;
  }
  return [];
}
