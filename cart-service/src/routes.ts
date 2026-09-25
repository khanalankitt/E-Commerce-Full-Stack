import { Router, type Request, type Response } from "express";
import CartController from "./modules/cart/cart.controller.js";
import { authenticate } from "./middlewares/auth.middleware.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "Cart service is up and healthy!" });
});

router.use(authenticate);

router.get("/", CartController.get);
router.post("/add", CartController.add);
router.delete("/:productId", CartController.delete);
router.delete("/", CartController.deleteAll);
router.patch("/:productId", CartController.updateQuantity);

export default router;
