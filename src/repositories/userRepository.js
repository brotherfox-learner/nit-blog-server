import pool from "../utils/db.mjs";
import { createClient } from "@supabase/supabase-js";

/**
 * Repository Layer สำหรับ User
 * ทำหน้าที่ติดต่อกับ Database เท่านั้น
 */

export const findAll = async () => {
  const result = await pool.query(
    `SELECT id, username, name, profile_pic, role, bio
     FROM users
     ORDER BY id`
  );
  return result.rows;
};

export const findById = async (id) => {
  const result = await pool.query(
    `SELECT id, username, name, profile_pic, role, bio
     FROM users
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

export const findByUsername = async (username) => {
  const result = await pool.query(
    "SELECT id, username, name, profile_pic, role, bio FROM users WHERE username = $1",
    [username]
  );
  return result.rows[0] || null;
};

export const updateById = async (id, userData) => {
  const { username, name, profile_pic, role, bio } = userData;
  const result = await pool.query(
    `UPDATE users
     SET username = COALESCE($1, username),
         name = COALESCE($2, name),
         profile_pic = COALESCE($3, profile_pic),
         role = COALESCE($4, role),
         bio = COALESCE($5, bio)
     WHERE id = $6
     RETURNING id, username, name, profile_pic, role, bio`,
    [username, name, profile_pic, role, bio, id]
  );
  return result.rows[0] || null;
};

export const deleteById = async (id) => {
  const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
  return result.rowCount > 0;
};


// สำหรับดึงรูปและชื่อคนเดียว id = fb79d5ea-8598-45a6-aadb-605b6d1af81d เท่านั้นไม่ต้อง auth
export const findByIdForProfile = async () => {
  const result = await pool.query(
    `SELECT name, profile_pic
     FROM users
     WHERE id = $1`,
    ['fb79d5ea-8598-45a6-aadb-605b6d1af81d']
  );
  return result.rows[0] || null;
};

// ตรวจสอบรหัสผ่านปัจจุบันของ user โดย sign in ด้วย email + password
export const verifyUserPassword = async (email, password) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

// อัพเดตรหัสผ่านใหม่ โดยใช้ Supabase Admin API (Service Role) — ไม่ต้องใช้ session ของ user
export const updateUserPassword = async (userId, newPassword) => {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  return await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword,
  });
};

