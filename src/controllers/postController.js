import * as postService from "../services/postService.js";

/**
 * Controller Layer สำหรับ Post
 * ทำหน้าที่จัดการ req/res และเรียกใช้ Service เพื่อประมวลผลข้อมูล
 * ดึงข้อมูลที่ผ่านการตรวจสอบแล้วจาก req.body
 * สร้าง Input DTO และส่งให้ Service Layer
 * รับค่าจาก Service แล้วสร้าง Output DTO และส่ง res กลับไป
 */

// GET /posts - ดึงข้อมูลบทความทั้งหมด (pagination, category, keyword)
export const getPosts = async (req, res, next) => {
  try {
    const { page, limit, category, keyword } = req.query;
    const filters = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 6,
      category: category || undefined,
      keyword: keyword || undefined,
    };

    const result = await postService.getPosts(filters);
    res.status(200).json(result);
  } catch (error) {
    if (error.code === "ECONNREFUSED" || error.message?.includes("connection")) {
      return res.status(500).json({ message: "Server could not read post because database connection" });
    }
    next(error);
  }
};

// GET /posts/:postId - ดึงข้อมูลบทความอันเดียว
export const getPostById = async (req, res, next) => {
  try {
    const postId = req.params.postId ?? req.params.id;

    const post = await postService.getPostById(postId);
    res.status(200).json(post);
  } catch (error) {
    if (error.message === "POST_NOT_FOUND") {
      return res.status(404).json({ message: "Server could not find a requested post" });
    }
    if (error.code === "ECONNREFUSED" || error.message?.includes("connection")) {
      return res.status(500).json({ message: "Server could not read post because database connection" });
    }
    next(error);
  }
};

// สร้างข้อมูลใหม่ในตาราง posts
export const createPost = async (req, res, next) => {
  try {
    // ดึงข้อมูลที่ผ่านการตรวจสอบแล้วจาก req.body
    const postData = {
      title: req.body.title,
      image: req.body.image,
      category_id: req.body.category_id,
      description: req.body.description,
      content: req.body.content,
      status_id: req.body.status_id,
    };

    // ส่ง DTO ให้ Service Layer ทำงานต่อ
    const post = await postService.createPost(postData);

    // รับค่าจาก Service แล้วสร้าง Output DTO และส่ง res กลับไป
    res.status(201).json({ 
      message: "Created post successfully", 
      post: post 
    });
  } catch (error) {
    if (error.message === "Missing required fields") {
      return res.status(400).json({ 
        message: "Server could not create post because there are missing data from client" 
      });
    }
    next(error);
  }
};

// PUT /posts/:postId - แก้ไขบทความ
export const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.postId ?? req.params.id;
    const postData = {
      title: req.body.title,
      image: req.body.image,
      category_id: req.body.category_id,
      description: req.body.description,
      content: req.body.content,
      status_id: req.body.status_id,
    };

    const result = await postService.updatePost(postId, postData);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "POST_NOT_FOUND") {
      return res.status(404).json({ message: "Server could not find a requested post to update" });
    }
    if (error.code === "ECONNREFUSED" || error.message?.includes("connection")) {
      return res.status(500).json({ message: "Server could not update post because database connection" });
    }
    next(error);
  }
};

// DELETE /posts/:postId - ลบบทความ
export const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId ?? req.params.id;

    const result = await postService.deletePost(postId);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "POST_NOT_FOUND") {
      return res.status(404).json({ message: "Server could not find a requested post to delete" });
    }
    if (error.code === "ECONNREFUSED" || error.message?.includes("connection")) {
      return res.status(500).json({ message: "Server could not delete post because database connection" });
    }
    next(error);
  }
};