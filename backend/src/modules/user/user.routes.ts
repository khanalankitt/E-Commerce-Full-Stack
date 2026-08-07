import { Router } from "express";
import userController from "./user.controller.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { UserRole } from "../../models/user.model.js";

const router = Router();

router.get("/", authenticate, authorize(UserRole.ADMIN), userController.getAccount);
router.put("/", authenticate, authorize(UserRole.ADMIN), userController.updateProfile);
router.put("/password", authenticate, authorize(UserRole.ADMIN), userController.changePassword);

export default router;
