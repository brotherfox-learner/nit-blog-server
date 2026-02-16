import pg from "pg";
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

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default pool;