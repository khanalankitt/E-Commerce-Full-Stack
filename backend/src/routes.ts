import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import addressRoutes from "./modules/address/address.routes.js";
import orderRoutes from "./modules/order/order.routes.js";
import { getDashboardStats } from "./modules/dashboardStats/getDashboardStats.js";
import { authenticate, authorize } from "./middlewares/auth.middleware.js";
import { UserRole } from "./models/user.model.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/cart", cartRoutes);
router.use("/addresses", addressRoutes);
router.use("/orders", orderRoutes);

router.get(
  "/stats",
  authenticate,
  authorize(UserRole.ADMIN),
  getDashboardStats,
);

export default router;
