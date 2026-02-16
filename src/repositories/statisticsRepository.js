import pool from "../utils/db.mjs";

/**
 * Repository Layer สำหรับ Statistics (post_views + user_statistics)
 */

// --- post_views ---

export const createPostView = async ({ post_id, viewer_id, reading_time_seconds }) => {
  const result = await pool.query(
    `INSERT INTO post_views (post_id, viewer_id, reading_time_seconds)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [post_id, viewer_id || null, reading_time_seconds || 0]
  );
  return result.rows[0];
};

// --- user_statistics ---

// Upsert: สร้างหรืออัพเดต user_statistics
export const upsertUserStats = async (userId) => {
  const result = await pool.query(
    `INSERT INTO user_statistics (user_id, last_active, updated_at)
     VALUES ($1, NOW(), NOW())
     ON CONFLICT (user_id) DO UPDATE SET
       last_active = NOW(),
       updated_at = NOW()
     RETURNING *`,
    [userId]
  );
  return result.rows[0];
};

// อัพเดต last_active
export const updateLastActive = async (userId) => {
  await pool.query(
    `INSERT INTO user_statistics (user_id, last_active, updated_at)
     VALUES ($1, NOW(), NOW())
     ON CONFLICT (user_id) DO UPDATE SET
       last_active = NOW(),
       updated_at = NOW()`,
    [userId]
  );
};

// ดึง stats สำหรับ admin/author (คำนวณสดจาก DB)
export const getAdminStats = async (userId) => {
  const result = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM posts WHERE user_id = $1) AS total_posts,
       (SELECT COUNT(*) FROM likes l JOIN posts p ON l.post_id = p.id WHERE p.user_id = $1) AS total_likes,
       (SELECT COUNT(*) FROM comments c JOIN posts p ON c.post_id = p.id WHERE p.user_id = $1) AS total_comments,
       (SELECT COALESCE(SUM(pv.reading_time_seconds), 0) FROM post_views pv JOIN posts p ON pv.post_id = p.id WHERE p.user_id = $1) AS total_reading_time,
       (SELECT last_active FROM user_statistics WHERE user_id = $1) AS last_active`,
    [userId]
  );
  return result.rows[0] || null;
};

// ดึง stats สำหรับ user ทั่วไป
export const getUserStats = async (userId) => {
  const result = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM comments WHERE user_id = $1) AS total_comments,
       (SELECT COALESCE(SUM(reading_time_seconds), 0) FROM post_views WHERE viewer_id = $1) AS total_reading_time,
       (SELECT last_active FROM user_statistics WHERE user_id = $1) AS last_active`,
    [userId]
  );
  return result.rows[0] || null;
};
