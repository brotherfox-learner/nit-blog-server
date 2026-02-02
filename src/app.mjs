import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - ใช้ console.log แทน stdout เพื่อหลีกเลี่ยง buffering issue ใน Windows
app.use(morgan("dev", {
  stream: { write: (msg) => console.log(msg.trimEnd()) }
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(cors());

// test  (before routes so it's not caught by router)
app.get("/api/test", (req, res) => {
  res.json({ status: "ok", message: "Server is running" , "data":  {
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
  const message =
    process.env.NODE_ENV === "production"
      ? "Server could not process your request because database connection"
      : err.message;

  res.status(statusCode).json({ message: message });
});


const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
