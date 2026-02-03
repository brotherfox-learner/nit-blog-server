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
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 10000
});

export default pool;