import type { AdminAccount, Category, DashboardStats, Product } from "./types";

const BASE = "/api";

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

export const getDashboardData = async (): Promise<{
  stats: DashboardStats;
  products: Product[];
  categories: Category[];
}> => {
  const [stats, products, categories] = await Promise.all([
    getStats(),
    request<{ data: Product[] }>("/products?limit=100"),
    request<{ data: Category[] }>("/categories"),
  ]);
  return {
    stats,
    products: products.data,
    categories: categories.data,
  };
};

// ---------- Products ----------

export const getProducts = async (): Promise<Product[]> => {
  const res = await request<{ data: Product[] }>("/products");
  return res.data;
};

export const createProduct = async (formData: FormData): Promise<Product> => {
  const res = await request<{ data: Product }>("/products", {
    method: "POST",
    body: formData,
  });
  return res.data;
};

export const updateProduct = async (
  id: string,
  formData: FormData,
): Promise<Product> => {
  const res = await request<{ data: Product }>(`/products/${id}`, {
    method: "PATCH",
    body: formData,
  });
  return res.data;
};

export const deleteProduct = (id: string): Promise<void> =>
  request<void>(`/products/${id}`, { method: "DELETE" });

// ---------- Categories ----------

export const getCategories = async (): Promise<Category[]> => {
  const res = await request<{ data: Category[] }>("/categories");
  return res.data;
};

export const createCategory = async (
  name: string,
  slug: string,
): Promise<Category> => {
  const res = await request<{ data: Category }>("/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, slug }),
  });
  return res.data;
};

export const updateCategory = async (
  id: string,
  name: string,
  slug: string,
): Promise<Category> => {
  const res = await request<{ data: Category }>(`/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name, slug }),
  });
  return res.data;
};

export const deleteCategory = (id: string): Promise<void> =>
  request<void>(`/categories/${id}`, { method: "DELETE" });

// ---------- Account ----------

export const getAccount = async (): Promise<AdminAccount> => {
  const res = await request<{ data: AdminAccount }>("/account");
  return res.data;
};

export const updateAccount = async (data: {
  name: string;
  email: string;
}): Promise<AdminAccount> => {
  const res = await request<{ data: AdminAccount }>("/account", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.data;
};

export const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> =>
  request<void>("/account/password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
