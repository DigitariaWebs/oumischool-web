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
  uploader: {
    id: string;
    email: string;
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

export type UpdateResourcePayload = Partial<CreateResourcePayload>;

export const resourcesApi = {
  list: async () => {
    const res = await api.get<
      AdminResource[] | PaginatedListResponse<AdminResource>
    >("/admin/resources");
    return asList<AdminResource>(res);
  },
  create: (body: CreateResourcePayload) =>
    api.post<AdminResource>("/resources", body),
  createUpload: (form: FormData) =>
    api.postForm<AdminResource>("/resources/upload", form),
  update: (id: string, body: UpdateResourcePayload) =>
    api.put<AdminResource>(`/resources/${id}`, body),
  archive: (id: string) => api.del<unknown>(`/resources/${id}`),
};
