import { Router } from "express";
import CartController from "./cart.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", CartController.get);
router.post("/add", CartController.add);
router.delete("/:productId", CartController.delete);
router.delete("/", CartController.deleteAll);
router.patch("/:productId", CartController.updateQuantity);

export default router;
