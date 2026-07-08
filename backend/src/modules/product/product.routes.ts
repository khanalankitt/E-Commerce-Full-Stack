import { Router } from "express";
import productController from "./product.controller.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { UserRole } from "../../models/user.model.js";

const router = Router();

// Public routes
router.get("/", productController.getAll);
router.get("/:id", productController.getOne);

// Protected routes
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  productController.create,
);
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  productController.update,
);
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  productController.delete,
);

export default router;
