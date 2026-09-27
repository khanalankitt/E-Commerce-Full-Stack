import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = Router();

const identityServiceUrl = process.env.IDENTITY_SERVICE_URL!;

router.use(
  "/auth",
  createProxyMiddleware({
    target: identityServiceUrl,
    changeOrigin: true,
    pathRewrite: (path, req: any) => req.originalUrl.replace(/^\/api/, ""),
  }),
);

router.use(
  "/users",
  createProxyMiddleware({
    target: identityServiceUrl,
    changeOrigin: true,
    pathRewrite: (path, req: any) => req.originalUrl.replace(/^\/api/, ""),
  }),
);

router.use(
  "/addresses",
  createProxyMiddleware({
    target: identityServiceUrl,
    changeOrigin: true,
    pathRewrite: (path, req: any) => req.originalUrl.replace(/^\/api/, ""),
  }),
);

export default router;
