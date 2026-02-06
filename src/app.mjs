import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGINS = process.env.CORS_ORIGIN
?.split(",")
.map(o => o.trim());

// Middleware - ใช้ console.log แทน stdout เพื่อหลีกเลี่ยง buffering issue ใน Windows
app.use(morgan("dev", {
  stream: { write: (msg) => console.log(msg.trimEnd()) }
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(cors({ origin: ALLOWED_ORIGINS }));

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
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message; // แสดง error จริงชั่วคราวเพื่อ debug

  res.status(statusCode).json({ message: message });
});


// Export for Vercel serverless
export default app;

// Run server locally (skip on Vercel)
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}
