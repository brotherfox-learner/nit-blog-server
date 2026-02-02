import pg from "pg";
import dotenv from "dotenv";

dotenv.config(); // ต้องเรียกที่นี่ เพราะ db.mjs โหลดก่อน app.mjs (ES modules import order)

const { Pool } = pg;

// ลบ quotes ออกจาก password ถ้ามี
const password = (process.env.DB_PASSWORD || "").replace(/^['"]|['"]$/g, "");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL !== "false" ? { rejectUnauthorized: false } : false,
  min: 1, // คง connection อย่างน้อย 1 ตัว — ป้องกัน Node.js exit
});

// เชื่อมต่อทันทีเมื่อ import (ไม่รอ lazy)
pool.connect().then(() => {
  console.log("✅ Database connected");
}).catch((err) => {
  console.error("❌ Database connection error:", err.message);
});

export default pool;