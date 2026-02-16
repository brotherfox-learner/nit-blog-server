import pool from "../utils/db.mjs";

/**
 * Repository Layer สำหรับ Status
 * ทำหน้าที่ติดต่อกับ Database เท่านั้น
 */

export const findAll = async () => {
  const result = await pool.query(
    "SELECT id, status FROM statuses ORDER BY id"
  );
  return result.rows;
};

export const findById = async (id) => {
  const result = await pool.query(
    "SELECT id, status FROM statuses WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};
