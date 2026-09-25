import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = Router();

const orderServiceUrl = process.env.ORDER_SERVICE_URL!;

router.use(
  "/orders",
  createProxyMiddleware({
    target: orderServiceUrl,
    changeOrigin: true,
  }),
);

export default router;
