const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Gadget {
  id: number;
  name: string;
  description: string;
  created: string;
  last_modified: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new ApiError(response.status, error.error || error.detail || 'Request failed');
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  login: (username: string, password: string) =>
    request<LoginResponse>('/api/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getMe: () => request<User>('/api/auth/me/'),

  logout: () =>
    request<void>('/api/auth/logout/', {
      method: 'POST',
    }),

  getGadgets: () => request<Gadget[]>('/api/gadgets/'),

  getGadget: (id: number) => request<Gadget>(`/api/gadgets/${id}/`),

  createGadget: (data: { name: string; description: string }) =>
    request<Gadget>('/api/gadgets/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateGadget: (id: number, data: { name?: string; description?: string }) =>
    request<Gadget>(`/api/gadgets/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteGadget: (id: number) =>
    request<void>(`/api/gadgets/${id}/`, {
      method: 'DELETE',
    }),

  bulkDeleteGadgets: (ids: number[]) =>
    request<{ deleted: number[] }>('/api/gadgets/bulk_delete/', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    }),
};
