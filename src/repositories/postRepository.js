import pool from "../utils/db.mjs";

/**
 * Repository Layer สำหรับ Post
 * ทำหน้าที่ติดต่อกับ Database เท่านั้น
 * ไม่รู้จัก req, res, DTO หรือ Business Logic
 */

// ดึงข้อมูล posts ทั้งหมดพร้อม pagination และ filter (category, keyword on title/description/content)
export const getAllPosts = async (filters = {}) => {
  const { page = 1, limit = 6, category, keyword } = filters;
  const offset = (page - 1) * limit;

  const conditions = [];
  const params = [];
  let paramIndex = 1;

  if (category && category.trim()) {
    // รองรับทั้ง category name (string) และ category_id (number)
    if (isNaN(category)) {
      // ถ้าเป็น string ให้ค้นหาจากชื่อ category
      conditions.push(`c.name ILIKE $${paramIndex}`);
      params.push(category.trim());
    } else {
      // ถ้าเป็น number ให้ค้นหาจาก category_id
      conditions.push(`p.category_id = $${paramIndex}`);
      params.push(parseInt(category, 10));
    }
    paramIndex++;
  }

  if (keyword && keyword.trim()) {
    conditions.push(`(p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex} OR p.content ILIKE $${paramIndex})`);
    params.push(`%${keyword.trim()}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countQuery = `
    SELECT COUNT(*) FROM posts p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN statuses s ON s.id = p.status_id
    ${whereClause}
  `;
  const countResult = await pool.query(countQuery, params);
  const totalPosts = parseInt(countResult.rows[0].count, 10);

  params.push(limit, offset);
  const dataQuery = `
    SELECT
      p.id, p.title, p.image, p.description, p.content, p.date,
      c.name AS category,
      s.status AS status,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes_count
    FROM posts p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN statuses s ON s.id = p.status_id
    ${whereClause}
    ORDER BY p.date DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;
  const dataResult = await pool.query(dataQuery, params);

  return {
    posts: dataResult.rows,
    totalPosts,
  };
};

// ดึงข้อมูล post ตาม id พร้อม category name, status name, likes_count
export const getPostById = async (id) => {
  const result = await pool.query(
    `SELECT
       p.id, p.title, p.image, p.description, p.content, p.date,
       p.category_id, p.status_id,
       c.name AS category,
       s.status AS status,
       (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes_count
     FROM posts p
     LEFT JOIN categories c ON c.id = p.category_id
     LEFT JOIN statuses s ON s.id = p.status_id
     WHERE p.id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

// สร้าง post ใหม่
export const createPost = async (postData) => {
  const { title, image, category_id, description, content, status_id } = postData;
  const result = await pool.query(
    "INSERT INTO posts (title, image, category_id, description, content, status_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [title, image, category_id, description, content, status_id]
  );
  return result.rows[0];
};

// อัพเดต post ตาม id
export const updatePostById = async (id, postData) => {
  const { title, image, category_id, description, content, status_id } = postData;
  const result = await pool.query(
    "UPDATE posts SET title = $1, image = $2, category_id = $3, description = $4, content = $5, status_id = $6 WHERE id = $7 RETURNING *",
    [title, image, category_id, description, content, status_id, id]
  );
  return result.rows[0] || null;
};

// ลบ post ตาม id
export const deletePostById = async (id) => {
  const result = await pool.query("DELETE FROM posts WHERE id = $1 RETURNING *", [id]);
  return result.rows[0] || null;
};

// ตรวจสอบว่า title มีอยู่แล้วหรือไม่ (สำหรับ business logic)
export const findPostByTitle = async (title) => {
  const result = await pool.query("SELECT * FROM posts WHERE title = $1", [title]);
  return result.rows[0] || null;
};
