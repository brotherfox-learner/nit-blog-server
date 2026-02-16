import pool from "../utils/db.mjs";

/**
 * Repository Layer สำหรับ Notification
 * ทำหน้าที่ติดต่อกับ Database เท่านั้น
 */

// สร้าง notification ใหม่
export const create = async (data) => {
  const {
    recipient_id,
    actor_id,
    type,
    post_id,
    comment_id,
    post_title,
    comment_text,
  } = data;

  const result = await pool.query(
    `INSERT INTO notifications
       (recipient_id, actor_id, type, post_id, comment_id, post_title, comment_text)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [recipient_id, actor_id, type, post_id || null, comment_id || null, post_title || null, comment_text || null]
  );
  return result.rows[0];
};

// ดึง notifications ตาม recipient_id พร้อมข้อมูล actor
export const findByRecipientId = async (recipientId, { limit = 20, offset = 0 } = {}) => {
  const result = await pool.query(
    `SELECT
       n.id, n.recipient_id, n.actor_id, n.type,
       n.post_id, n.comment_id, n.post_title, n.comment_text,
       n.is_read, n.read_at, n.created_at,
       u.name AS actor_name,
       u.username AS actor_username,
       u.profile_pic AS actor_avatar
     FROM notifications n
     LEFT JOIN users u ON u.id = n.actor_id
     WHERE n.recipient_id = $1
     ORDER BY n.created_at DESC
     LIMIT $2 OFFSET $3`,
    [recipientId, limit, offset]
  );
  return result.rows;
};

// นับ notifications ที่ยังไม่อ่าน
export const countUnread = async (recipientId) => {
  const result = await pool.query(
    "SELECT COUNT(*) AS count FROM notifications WHERE recipient_id = $1 AND is_read = FALSE",
    [recipientId]
  );
  return parseInt(result.rows[0].count, 10);
};

// mark as read ทีละอัน
export const markAsRead = async (id, recipientId) => {
  const result = await pool.query(
    `UPDATE notifications
     SET is_read = TRUE, read_at = NOW()
     WHERE id = $1 AND recipient_id = $2
     RETURNING *`,
    [id, recipientId]
  );
  return result.rows[0] || null;
};

// mark all as read
export const markAllAsRead = async (recipientId) => {
  const result = await pool.query(
    `UPDATE notifications
     SET is_read = TRUE, read_at = NOW()
     WHERE recipient_id = $1 AND is_read = FALSE
     RETURNING id`,
    [recipientId]
  );
  return result.rowCount;
};

// สร้าง notification ให้ user ทุกคน (ยกเว้น actor) — ใช้สำหรับ new_post / post_update
export const createBulkForAllUsers = async (data) => {
  const { actor_id, type, post_id, post_title } = data;

  const result = await pool.query(
    `INSERT INTO notifications (recipient_id, actor_id, type, post_id, post_title)
     SELECT u.id, $1, $2, $3, $4
     FROM users u
     WHERE u.id != $1
     RETURNING id`,
    [actor_id, type, post_id, post_title]
  );
  return result.rowCount;
};

// ลบ notification
export const deleteById = async (id, recipientId) => {
  const result = await pool.query(
    "DELETE FROM notifications WHERE id = $1 AND recipient_id = $2 RETURNING id",
    [id, recipientId]
  );
  return result.rowCount > 0;
};
