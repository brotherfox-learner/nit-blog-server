import * as commentService from "../services/commentService.js";

/**
 * Controller Layer สำหรับ Comment
 * ทำหน้าที่จัดการ req/res และเรียกใช้ Service เพื่อประมวลผลข้อมูล
 * ดึงข้อมูลที่ผ่านการตรวจสอบแล้วจาก req.body
 * สร้าง Input DTO และส่งให้ Service Layer
 * รับค่าจาก Service แล้วสร้าง Output DTO และส่ง res กลับไป
 */

// สร้างความคิดเห็นใหม่
export const createComment = async (req, res, next) => {
  try {
    // ดึงข้อมูลที่ผ่านการตรวจสอบแล้วจาก req.body
    const commentData = {
      post_id: req.body.post_id,
      user_id: req.body.user_id,
      comment_text: req.body.comment_text,
    };

    // ส่ง DTO ให้ Service Layer ทำงานต่อ
    const comment = await commentService.createComment(commentData);

    // รับค่าจาก Service แล้วสร้าง Output DTO และส่ง res กลับไป
    res.status(201).json(comment);
  } catch (error) {
    if (error.message === "post_id, user_id, comment_text are required") {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === "Post not found") {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

// ดึงความคิดเห็นตาม post_id
export const getCommentsByPostId = async (req, res, next) => {
  try {
    const { post_id } = req.params;

    // ส่ง DTO ให้ Service Layer ทำงานต่อ
    const comments = await commentService.getCommentsByPostId(post_id);

    // รับค่าจาก Service แล้วสร้าง Output DTO และส่ง res กลับไป
    res.json(comments);
  } catch (error) {
    if (error.message === "Post not found") {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

// ดึงความคิดเห็นตาม user_id
export const getCommentsByUserId = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    // ส่ง DTO ให้ Service Layer ทำงานต่อ
    const comments = await commentService.getCommentsByUserId(user_id);

    // รับค่าจาก Service แล้วสร้าง Output DTO และส่ง res กลับไป
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// อัปเดตความคิดเห็นตาม comment_id
export const updateCommentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // ดึงข้อมูลที่ผ่านการตรวจสอบแล้วจาก req.body
    const commentData = {
      comment_text: req.body.comment_text,
    };

    // ส่ง DTO ให้ Service Layer ทำงานต่อ
    const updatedComment = await commentService.updateCommentById(id, commentData);

    // รับค่าจาก Service แล้วสร้าง Output DTO และส่ง res กลับไป
    res.json(updatedComment);
  } catch (error) {
    if (error.message === "comment_text is required") {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === "Comment not found") {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

// ลบความคิดเห็นตาม comment_id
export const deleteCommentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ส่ง DTO ให้ Service Layer ทำงานต่อ
    const result = await commentService.deleteCommentById(id);

    // รับค่าจาก Service แล้วสร้าง Output DTO และส่ง res กลับไป
    res.json(result);
  } catch (error) {
    if (error.message === "Comment not found") {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};
