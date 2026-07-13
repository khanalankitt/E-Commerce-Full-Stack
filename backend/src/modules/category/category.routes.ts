import { Router } from "express";
import categoryController from "./category.controller.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { UserRole } from "../../models/user.model.js";

const router = Router();

// Public routes
router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getOne);
router.get("/:id/products", categoryController.getProductsByCategory);
router.get("/products/:slug", categoryController.getProductsByCategorySlug);

router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  categoryController.create,
);
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  categoryController.update,
);
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  categoryController.delete,
);

export default router;
