import { api, asList, PaginatedListResponse } from "@/lib/api-client";

export interface AdminResource {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  type: string;
  status: string;
  fileUrl: string | null;
  fileSize: string | null;
  views: number;
  downloads: number;
  tags: string[];
  isPaid: boolean;
  price: number | null; // in cents
  uploader: {
    id: string;
    email: string;
    role: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResourcePayload {
  title: string;
  subject: string;
  type: string;
  fileUrl: string;
  fileSize?: string;
  description?: string;
  tags?: string[];
  status?: string;
}

export type UpdateResourcePayload = Partial<CreateResourcePayload> & {
  isPaid?: boolean;
  price?: number;
};

export const resourcesApi = {
  list: async () => {
    const res = await api.get<
      AdminResource[] | PaginatedListResponse<AdminResource>
    >("/admin/resources");
    return asList<AdminResource>(res);
  },
  detail: (id: string) => api.get<AdminResource>(`/admin/resources/${id}`),
  create: (body: CreateResourcePayload) =>
    api.post<AdminResource>("/resources", body),
  createUpload: (form: FormData) =>
    api.postForm<AdminResource>("/resources/upload", form),
  update: (id: string, body: UpdateResourcePayload) =>
    api.put<AdminResource>(`/resources/${id}`, body),
  updateStatus: (id: string, status: string) =>
    api.put<AdminResource>(`/admin/resources/${id}/status`, {
      status: status.toUpperCase(),
    }),
  archive: (id: string) =>
    api.post<unknown>(`/admin/resources/${id}/archive`, {}),
  getActivity: (id: string) =>
    api.get<ResourceActivity>(`/admin/resources/${id}/activity`),
  generateViewToken: (id: string) =>
    api.post<{ token: string; expiresAt: string }>(
      `/resources/${id}/view-token`,
      {},
    ),
};

export type ResourceActivity =
  | {
      type: "orders";
      entries: {
        id: string;
        email: string;
        amount: number; // in cents
        status: string;
        date: string;
      }[];
    }
  | {
      type: "library";
      entries: {
        id: string;
        email: string;
        date: string;
      }[];
    };
