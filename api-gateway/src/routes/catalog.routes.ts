import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = Router();

const catalogServiceUrl = process.env.CATALOG_SERVICE_URL!;

router.use(
  "/products",
  createProxyMiddleware({
    target: catalogServiceUrl,
    changeOrigin: true,
  }),
);

router.use(
  "/categories",
  createProxyMiddleware({
    target: catalogServiceUrl,
    changeOrigin: true,
  }),
);

export default router;
