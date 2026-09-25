import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = Router();

const identityServiceUrl = process.env.IDENTITY_SERVICE_URL!;

router.use(
  "/auth",
  createProxyMiddleware({
    target: identityServiceUrl,
    changeOrigin: true,
  }),
);

router.use(
  "/users",
  createProxyMiddleware({
    target: identityServiceUrl,
    changeOrigin: true,
  }),
);

router.use(
  "/addresses",
  createProxyMiddleware({
    target: identityServiceUrl,
    changeOrigin: true,
  }),
);

export default router;
