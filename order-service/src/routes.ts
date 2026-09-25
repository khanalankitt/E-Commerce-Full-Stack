import { Router, type Request, type Response } from "express";
import OrderController from "./modules/order/order.controller.js";
import { authenticate } from "./middlewares/auth.middleware.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "Order service is up and healthy!" });
});

router.use(authenticate);

router.post("/", OrderController.create);
router.get("/", OrderController.getAll);
router.get("/:orderId", OrderController.getOne);
router.patch("/:orderId/place", OrderController.place);

export default router;
