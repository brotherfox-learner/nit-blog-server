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

// ========== Server-side Auth Operations ==========

// Sign up ผ่าน Supabase Admin (server-side)
export const signUpWithEmail = async ({ email, password, username, name }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, username },
    },
  });
  return { data, error };
};

// Sign in ผ่าน Supabase Admin (server-side)
export const signInWithEmail = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// ตรวจสอบว่า email ซ้ำหรือไม่ (ใน public.users)
export const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT id, username, email FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0] || null;
};
