import { Router } from "express";
import type { Request, Response } from "express";
import productRoutes from "./modules/product/product.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ message: "Catalog service is up and healthy!" });
});

router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);

export default router;
