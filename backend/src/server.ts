import app from "./app.js";
import { connectDB } from "./config/database.js";
import { env } from "./config/env.js";
import "./models/index.js";

async function startServer() {
  try {
    await connectDB();
    console.log("✅ Database connected");

    if (process.env.NODE_ENV !== "production") {
      app.listen(env.PORT, () => {
        console.log(`🚀 Server running on port ${env.PORT}`);
      });
    }
  } catch (err) {
    console.error("❌ Failed to start server", err);
    process.exit(1);
  }
}

startServer();

export default app;

