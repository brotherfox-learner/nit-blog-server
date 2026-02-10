import { createClient } from "@supabase/supabase-js";
import pool from "../utils/db.mjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env") });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
);

/**
 * Repository Layer สำหรับ Auth
 * ทำหน้าที่ติดต่อกับ Supabase Auth + PostgreSQL
 *
 * หมายเหตุ: การสร้าง user profile ใน public.users ถูกจัดการโดย
 * Supabase trigger (AFTER INSERT ON auth.users → INSERT public.users) แล้ว
 */

// ตรวจสอบ token แล้วดึง Supabase user
export const getUserFromToken = async (token) => {
  const { data, error } = await supabase.auth.getUser(token);
  return { data, error };
};

// ดึง user profile จาก PostgreSQL ด้วย id (uuid จาก Supabase Auth)
export const findUserById = async (userId) => {
  const result = await pool.query(
    "SELECT id, username, name, role, profile_pic, bio FROM users WHERE id = $1",
    [userId]
  );
  return result.rows[0] || null;
};

// ตรวจสอบว่า username ซ้ำหรือไม่
export const findUserByUsername = async (username) => {
  const result = await pool.query(
    "SELECT id, username FROM users WHERE username = $1",
    [username]
  );
  return result.rows[0] || null;
};

// อัพเดต user profile
export const updateUserProfile = async (userId, profileData) => {
  const { username, name, profile_pic, bio } = profileData;
  const result = await pool.query(
    `UPDATE users
     SET username = COALESCE($1, username),
         name = COALESCE($2, name),
         profile_pic = COALESCE($3, profile_pic),
         bio = COALESCE($4, bio)
     WHERE id = $5
     RETURNING id, username, name, role, profile_pic, bio`,
    [username, name, profile_pic, bio, userId]
  );
  return result.rows[0] || null;
};
