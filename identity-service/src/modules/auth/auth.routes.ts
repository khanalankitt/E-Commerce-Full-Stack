import { Router } from "express";
import { authController } from "./auth.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authenticate, authController.logout);

router.get("/me", authenticate, authController.me);

router.post("/admin/login", authController.adminLogin);

export default router;
