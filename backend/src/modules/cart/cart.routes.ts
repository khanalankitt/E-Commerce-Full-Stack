import { Router } from "express";
import CartController from "./cart.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, CartController.get);
router.post("/add", authenticate, CartController.add);
router.delete("/:productId", authenticate, CartController.delete);
router.delete("/", authenticate, CartController.deleteAll);
router.patch("/:productId", CartController.updateQuantity);

export default router;
