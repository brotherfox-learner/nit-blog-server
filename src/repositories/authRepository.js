import { createClient } from "@supabase/supabase-js";
import pool from "../utils/db.mjs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

/**
 * Repository Layer สำหรับ Auth
 * ทำหน้าที่ติดต่อกับ Database และ Supabase เท่านั้น
 * ไม่รู้จัก req, res, DTO หรือ Business Logic
 */

// ตรวจสอบว่า username มีอยู่แล้วหรือไม่
export const findUserByUsername = async (username) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );
  return result.rows[0] || null;
};

// สร้าง user ใน Supabase
export const createSupabaseUser = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

// สร้าง user ใน PostgreSQL database
export const createUser = async (userId, username, name, role = "user") => {
  const result = await pool.query(
    `INSERT INTO users (id, username, name, role) VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, username, name, role]
  );
  return result.rows[0];
};

// Login ด้วย Supabase
export const signInWithPassword = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// ดึงข้อมูล user จาก Supabase ด้วย token
export const getUserFromToken = async (token) => {
  const { data, error } = await supabase.auth.getUser(token);
  return { data, error };
};

// ดึงข้อมูล user จาก PostgreSQL database ด้วย id
export const findUserById = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE id = $1`,
    [userId]
  );
  return result.rows[0] || null;
};
