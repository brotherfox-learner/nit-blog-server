import pool from "../utils/db.mjs";

/**
 * Repository Layer สำหรับ Category
 * ทำหน้าที่ติดต่อกับ Database เท่านั้น
 */

export const findAll = async () => {
  const result = await pool.query(
    "SELECT id, name FROM categories ORDER BY id"
  );
  return result.rows;
};

export const findById = async (id) => {
  const result = await pool.query(
    "SELECT id, name FROM categories WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

export const findByName = async (name) => {
  const result = await pool.query(
    "SELECT id, name FROM categories WHERE name = $1",
    [name]
  );
  return result.rows[0] || null;
};

export const create = async (categoryData) => {
  const { name } = categoryData;
  const result = await pool.query(
    "INSERT INTO categories (name) VALUES ($1) RETURNING id, name",
    [name]
  );
  return result.rows[0];
};

export const updateById = async (id, categoryData) => {
  const { name } = categoryData;
  const result = await pool.query(
    "UPDATE categories SET name = $1 WHERE id = $2 RETURNING id, name",
    [name, id]
  );
  return result.rows[0] || null;
};

export const deleteById = async (id) => {
  const result = await pool.query("DELETE FROM categories WHERE id = $1 RETURNING id", [id]);
  return result.rowCount > 0;
};
