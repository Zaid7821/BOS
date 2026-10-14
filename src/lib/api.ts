// In development Vite proxies /api to localhost:5000, so an empty base URL works.
// In production set VITE_API_BASE_URL to the backend URL (e.g. your Render service).
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

type ApiResult<T = unknown> = { success: boolean; message?: string; data?: T; token?: string };

export async function api<T = unknown>(path: string, options: RequestInit = {}, token?: string): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    const body = await res.json().catch(() => ({}));
    return { success: res.ok && body.success !== false, ...body, status: res.status } as ApiResult<T>;
  } catch {
    return { success: false, message: "Could not reach the server. Please check your internet connection or call us." };
  }
}
