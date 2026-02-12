import { createClient } from "@supabase/supabase-js";
import pool from "../utils/db.mjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const envPath = path.resolve(__dirname, "..", "..", ".env");

// โหลด .env เฉพาะถ้ามีไฟล์ (local dev) — บน Vercel ใช้ env vars จาก Dashboard
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
);

/**
 * Middleware: protectUser
 * ตรวจสอบ Supabase JWT token จาก Authorization header
 * แล้วใส่ข้อมูล user ลง req.user
 */
export const protectUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }

    // ใส่ supabase auth user ลง req.user (มี id, email, aud, role ฯลฯ)
    req.user = data.user;
    next();
  } catch (err) {
    console.error("protectUser middleware error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Middleware: protectAdmin
 * ตรวจสอบ token + ตรวจสอบ role = "admin" จาก users table
 */
export const protectAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }

    // ดึง role จาก users table
    const { rows } = await pool.query(
      "SELECT role FROM users WHERE id = $1",
      [data.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User profile not found" });
    }

    req.user = { ...data.user, role: rows[0].role };

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    next();
  } catch (err) {
    console.error("protectAdmin middleware error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
