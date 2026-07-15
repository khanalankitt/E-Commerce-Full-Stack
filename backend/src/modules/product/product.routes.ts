import { Router } from "express";
import productController from "./product.controller.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { UserRole } from "../../models/user.model.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

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
  upload.single("image"),
  productController.update,
);
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  productController.delete,
);

export default router;
