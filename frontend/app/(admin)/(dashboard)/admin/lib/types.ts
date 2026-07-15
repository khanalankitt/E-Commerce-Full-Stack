export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: {
    _id: string;
    name: string;
  };
  image: string;
  isFeatured: boolean;
  rating: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  totalOrders: number;
}

export interface AdminAccount {
  _id: string;
  name: string;
  email: string;
}

export interface ApiError {
  message: string;
}
