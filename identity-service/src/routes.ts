import { Router } from "express";
import type { Request, Response } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ message: "Identity service is up and healthy!" });
});

router.use("/auth", authRoutes);
router.use("/account", userRoutes);

export default router;
