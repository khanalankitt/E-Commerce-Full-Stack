import type { Request, Response } from "express";
import { Product } from "../../models/product.model.js";
import { User } from "../../models/user.model.js";
import { Category } from "../../models/category.model.js";
import { Order } from "../../models/order.model.js";

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  totalOrders: number;
}

export const getDashboardStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const [totalProducts, totalCategories, totalUsers, totalOrders] =
      await Promise.all([
        Product.countDocuments(),
        Category.countDocuments(),
        User.countDocuments(),
        Order.countDocuments(),
      ]);

    const stats: DashboardStats = {
      totalProducts,
      totalCategories,
      totalUsers,
      totalOrders,
    };
    res.status(200).json(stats);
  } catch (error) {
    console.error("getDashboardStats error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
