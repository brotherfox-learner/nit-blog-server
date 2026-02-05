import * as commentRepository from "../repositories/commentRepository.js";
import * as postRepository from "../repositories/postRepository.js";

/**
 * Service Layer สำหรับ Comment
 * ทำหน้าที่จัดการ Business Logic ของระบบ
 * เรียกใช้ Repository เพื่อเข้าถึงข้อมูล
 * ไม่รู้จัก req, res
 */

// สร้าง comment ใหม่
export const createComment = async (commentData) => {
  const { post_id, user_id, comment_text } = commentData;
  
  // Business Logic: ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
  if (!post_id || !user_id || !comment_text?.trim()) {
    throw new Error("post_id, user_id, comment_text are required");
  }
  
  // Business Logic: ตรวจสอบว่า post มีอยู่หรือไม่
  const post = await postRepository.findById(post_id);
  if (!post) {
    throw new Error("Post not found");
  }
  
  // เตรียมข้อมูลสำหรับการสร้าง comment
  const newCommentData = {
    post_id,
    user_id,
    comment_text: comment_text.trim(),
  };
  
  // เรียก Repository เพื่อบันทึกข้อมูล
  const comment = await commentRepository.create(newCommentData);
  
  return comment;
};

// ดึง comments ตาม post_id
export const getCommentsByPostId = async (post_id) => {
  // Business Logic: ตรวจสอบว่า post มีอยู่หรือไม่
  const post = await postRepository.findById(post_id);
  if (!post) {
    throw new Error("Post not found");
  }
  
  // เรียก Repository เพื่อดึงข้อมูล
  const comments = await commentRepository.findByPostId(post_id);
  
  return comments;
};

// ดึง comments ตาม user_id
export const getCommentsByUserId = async (user_id) => {
  // เรียก Repository เพื่อดึงข้อมูล
  const comments = await commentRepository.findByUserId(user_id);
  
  return comments;
};

// อัพเดต comment ตาม id
export const updateCommentById = async (id, commentData) => {
  const { comment_text } = commentData;
  
  // Business Logic: ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
  if (!comment_text?.trim()) {
    throw new Error("comment_text is required");
  }
  
  // Business Logic: ตรวจสอบว่า comment มีอยู่หรือไม่
  const existingComment = await commentRepository.findById(id);
  if (!existingComment) {
    throw new Error("Comment not found");
  }
  
  // เตรียมข้อมูลสำหรับการอัพเดต
  const updateData = {
    comment_text: comment_text.trim(),
  };
  
  // เรียก Repository เพื่ออัพเดตข้อมูล
  const updatedComment = await commentRepository.updateById(id, updateData);
  
  return updatedComment;
};

// ลบ comment ตาม id
export const deleteCommentById = async (id) => {
  // Business Logic: ตรวจสอบว่า comment มีอยู่หรือไม่
  const existingComment = await commentRepository.findById(id);
  if (!existingComment) {
    throw new Error("Comment not found");
  }
  
  // เรียก Repository เพื่อลบข้อมูล
  const deleted = await commentRepository.deleteById(id);
  
  if (!deleted) {
    throw new Error("Failed to delete comment");
  }
  
  return { message: "Comment deleted successfully" };
};
