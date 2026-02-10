import pool from "../utils/db.mjs";

/**
 * Repository Layer สำหรับ Like
 * ทำหน้าที่ติดต่อกับ Database เท่านั้น
 */

export const findByPostAndUser = async (post_id, user_id) => {
  const result = await pool.query(
    "SELECT id, post_id, user_id, liked_at FROM likes WHERE post_id = $1 AND user_id = $2",
    [post_id, user_id]
  );
  return result.rows[0] || null;
};

export const findByPostId = async (post_id) => {
  const result = await pool.query(
    `SELECT l.id, l.post_id, l.user_id, l.liked_at, u.username
     FROM likes l
     JOIN users u ON u.id = l.user_id
     WHERE l.post_id = $1
     ORDER BY l.liked_at DESC`,
    [post_id]
  );
  return result.rows;
};

export const countByPostId = async (post_id) => {
  const result = await pool.query(
    "SELECT COUNT(*) AS count FROM likes WHERE post_id = $1",
    [post_id]
  );
  return parseInt(result.rows[0].count, 10);
};

export const create = async (likeData) => {
  const { post_id, user_id } = likeData;
  const result = await pool.query(
    `INSERT INTO likes (post_id, user_id)
     VALUES ($1, $2)
     RETURNING id, post_id, user_id, liked_at`,
    [post_id, user_id]
  );
  return result.rows[0];
};

export const deleteByPostAndUser = async (post_id, user_id) => {
  const result = await pool.query(
    "DELETE FROM likes WHERE post_id = $1 AND user_id = $2 RETURNING id",
    [post_id, user_id]
  );
  return result.rowCount > 0;
};
