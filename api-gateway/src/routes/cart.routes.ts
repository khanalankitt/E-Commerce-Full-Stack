import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = Router();

const cartServiceUrl = process.env.CART_SERVICE_URL!;

router.use(
  "/cart",
  createProxyMiddleware({
    target: cartServiceUrl,
    changeOrigin: true,
  }),
);

export default router;