import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = Router();

const catalogServiceUrl = process.env.CATALOG_SERVICE_URL!;

router.use(
  "/products",
  createProxyMiddleware({
    target: catalogServiceUrl,
    changeOrigin: true,
    pathRewrite: (path, req: any) => req.originalUrl.replace(/^\/api/, ""),
  }),
);

router.use(
  "/categories",
  createProxyMiddleware({
    target: catalogServiceUrl,
    changeOrigin: true,
    pathRewrite: (path, req: any) => req.originalUrl.replace(/^\/api/, ""),
  }),
);

export default router;
