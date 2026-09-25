import express from "express";
import cors from "cors";

import identityRoutes from "./routes/identity.routes.js";
import catalogRoutes from "./routes/catalog.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// Gateway health check
app.get("/health", (_req, res) => {
  res.json({
    service: "api-gateway",
    status: "OK",
  });
});

// Microservice routes
app.use("/api", identityRoutes);
app.use("/api", catalogRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);

export default app;