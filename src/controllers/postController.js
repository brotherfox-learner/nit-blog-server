import pool from "../utils/db.mjs";

// ดึงข้อมูลทั้งหมดจากตาราง posts
export const getPosts = async (req, res, next) => {
  try {
    const data = await pool.query("SELECT * FROM posts");
    res.json({ posts: data.rows });
  } catch (error) {
    next(error);
  }
};

// ดึงข้อมูลจากตาราง posts ตาม id
export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (data.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ post: data.rows[0] });
  } catch (error) {
    next(error);
  }
};

// สร้างข้อมูลใหม่ในตาราง posts
export const createPost = async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.image || !req.body.category_id || !req.body.description || !req.body.content || !req.body.status_id) {
      return res.status(400).json({ "message": "Server could not create post because there are missing data from client" });
    }
    const { title, image, category_id, description, content, status_id } = req.body;
    const data = await pool.query("INSERT INTO posts (title, image, category_id, description, content, status_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [title, image, category_id, description, content, status_id]);
    res.status(201).json({ message: "Created post sucessfully", post: data.rows[0] });
  } catch (error) {
    next(error);
  }
};

// อัพเดตข้อมูลในตาราง posts ตาม id
export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, image, category_id, description, content, status_id } = req.body;
    const data = await pool.query("UPDATE posts SET title = $1, image = $2, category_id = $3, description = $4, content = $5, status_id = $6 WHERE id = $7 RETURNING *", [title, image, category_id, description, content, status_id, id]);
    res.status(200).json({ message: `Updated post ${id} sucessfully`, post: data.rows[0] });
  } catch (error) {
    next(error);
  }
};

// ลบข้อมูลในตาราง posts ตาม id
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await pool.query("DELETE FROM posts WHERE id = $1 RETURNING *", [id]);
    res.status(200).json({ message: `Deleted post ${id} sucessfully` });
  } catch (error) {
    next(error);
  }
};