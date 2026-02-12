import pool from "../utils/db.mjs";

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
