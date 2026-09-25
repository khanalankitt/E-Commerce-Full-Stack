import { Router } from "express";
import OrderController from "./order.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", OrderController.create);
router.get("/", OrderController.getAll);
router.get("/:orderId", OrderController.getOne);
router.patch("/:orderId/place", OrderController.place);

export default router;
