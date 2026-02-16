import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const envPath = path.resolve(__dirname, "..", ".env");

// โหลด .env เฉพาะถ้ามีไฟล์ (local dev) — บน Vercel ใช้ env vars จาก Dashboard
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGINS = process.env.CORS_ORIGIN
  ?.split(",")
  .map((o) => o.trim().replace(/\/+$/, ""))
  .filter(Boolean) ?? [];

// Middleware - ใช้ console.log แทน stdout เพื่อหลีกเลี่ยง buffering issue ใน Windows
app.use(morgan("dev", {
  stream: { write: (msg) => console.log(msg.trimEnd()) }
}));
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS Configuration - อนุญาต Authorization header สำหรับ like/auth
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// test  (before routes so it's not caught by router)
app.get("/api/test", (req, res) => {
  res.send({ status: "ok", message: "Server is running" , "data":  {
      "name": "john",
      "age": 20
  }});
});

// Routes
app.use("/api", routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({ message });
});


// Export for Vercel serverless
export default app;

// Run server locally (skip on Vercel)
if (process.env.VERCEL === "1") {
  console.log("Skipping listen (VERCEL=1)");
} else {
  const server = app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use.`);
    } else {
      console.error("Server error:", err);
    }
    process.exit(1);
  });
}
