import pool from "../utils/db.mjs";

/**
 * Repository Layer สำหรับ Comment
 * ทำหน้าที่ติดต่อกับ Database เท่านั้น
 * ไม่รู้จัก req, res, DTO หรือ Business Logic
 */

// สร้าง comment ใหม่
export const create = async (commentData) => {
  const { post_id, user_id, comment_text } = commentData;
  const result = await pool.query(
    `INSERT INTO comments (post_id, user_id, comment_text)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [post_id, user_id, comment_text]
  );
  return result.rows[0];
};

// ดึง comments ตาม post_id พร้อมข้อมูล user
export const findByPostId = async (post_id) => {
  const result = await pool.query(
    `SELECT 
       c.id, c.post_id, c.user_id, c.comment_text, c.created_at,
       u.username
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.post_id = $1
     ORDER BY c.created_at DESC`,
    [post_id]
  );
  return result.rows;
};

// ดึง comments ตาม user_id พร้อมข้อมูล post
export const findByUserId = async (user_id) => {
  const result = await pool.query(
    `SELECT 
       c.id, c.post_id, c.user_id, c.comment_text, c.created_at,
       p.title AS post_title
     FROM comments c
     JOIN posts p ON p.id = c.post_id
     WHERE c.user_id = $1
     ORDER BY c.created_at DESC`,
    [user_id]
  );
  return result.rows;
};

// ดึง comment ตาม id
export const findById = async (id) => {
  const result = await pool.query("SELECT * FROM comments WHERE id = $1", [id]);
  return result.rows[0] || null;
};

// อัพเดต comment ตาม id
export const updateById = async (id, commentData) => {
  const { comment_text } = commentData;
  const result = await pool.query(
    `UPDATE comments
     SET comment_text = $1
     WHERE id = $2
     RETURNING *`,
    [comment_text, id]
  );
  return result.rows[0] || null;
};

// ลบ comment ตาม id
export const deleteById = async (id) => {
  const result = await pool.query("DELETE FROM comments WHERE id = $1 RETURNING *", [id]);
  return result.rowCount > 0;
};
