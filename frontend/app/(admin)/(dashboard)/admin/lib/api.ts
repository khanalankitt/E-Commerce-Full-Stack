import type { AdminAccount, Category, DashboardStats, Product } from "./types";

// const BASE = "/api/admin";
const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(body.message || "Request failed");
  }

  // DELETE requests often return 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ---------- Dashboard ----------

export const getStats = (): Promise<DashboardStats> =>
  request<DashboardStats>("/stats");

// ---------- Products ----------

export const getProducts = (): Promise<Product[]> =>
  request<Product[]>("/products");

export const createProduct = (formData: FormData): Promise<Product> =>
  request<Product>("/products", { method: "POST", body: formData });

export const updateProduct = (
  id: string,
  formData: FormData,
): Promise<Product> =>
  request<Product>(`/products/${id}`, { method: "PATCH", body: formData });

export const deleteProduct = (id: string): Promise<void> =>
  request<void>(`/products/${id}`, { method: "DELETE" });

// ---------- Categories ----------

export const getCategories = (): Promise<Category[]> =>
  request<Category[]>("/categories");

export const createCategory = (formData: FormData): Promise<Category> =>
  request<Category>("/categories", { method: "POST", body: formData });

export const updateCategory = (
  id: string,
  formData: FormData,
): Promise<Category> =>
  request<Category>(`/categories/${id}`, { method: "PUT", body: formData });

export const deleteCategory = (id: string): Promise<void> =>
  request<void>(`/categories/${id}`, { method: "DELETE" });

// ---------- Account ----------

export const getAccount = (): Promise<AdminAccount> =>
  request<AdminAccount>("/account");

export const updateAccount = (data: {
  name: string;
  email: string;
}): Promise<AdminAccount> =>
  request<AdminAccount>("/account", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> =>
  request<void>("/account/password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
