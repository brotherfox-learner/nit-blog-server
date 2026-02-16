import * as postRepository from "../repositories/postRepository.js";
import * as notificationService from "./notificationService.js";

/**
 * Service Layer สำหรับ Post
 * ทำหน้าที่จัดการ Business Logic ของระบบ
 * เรียกใช้ Repository เพื่อเข้าถึงข้อมูล
 * ไม่รู้จัก req, res
 */

// ดึงข้อมูล posts ทั้งหมดพร้อม pagination และ filter
export const getPosts = async (filters = {}) => {
  const { page = 1, limit = 6 } = filters;

  const result = await postRepository.getAllPosts(filters);
  const { posts, totalPosts } = result;

  const totalPages = Math.ceil(totalPosts / limit);
  const nextPage = page < totalPages ? page + 1 : null;

  const formattedPosts = (posts || []).map((row) => ({
    id: row.id,
    image: row.image,
    category: row.category ?? null,
    category_id: row.category_id,
    title: row.title,
    description: row.description,
    date: row.date,
    content: row.content,
    status: row.status ?? null,
    status_id: row.status_id,
    user_id: row.user_id,
    author: row.author ?? null,
    author_avatar: row.author_avatar ?? null,
    author_bio: row.author_bio ?? null,
    likes_count: parseInt(row.likes_count, 10) || 0,
  }));

  return {
    totalPosts,
    totalPages,
    currentPage: page,
    limit,
    posts: formattedPosts,
    nextPage,
  };
};

// ดึงข้อมูล post ตาม id
export const getPostById = async (id) => {
  const post = await postRepository.getPostById(id);

  if (!post) {
    throw new Error("POST_NOT_FOUND");
  }

  return {
    id: post.id,
    image: post.image,
    category: post.category ?? null,
    category_id: post.category_id,
    title: post.title,
    description: post.description,
    date: post.date,
    content: post.content,
    status: post.status ?? null,
    status_id: post.status_id,
    user_id: post.user_id,
    author: post.author ?? null,
    author_avatar: post.author_avatar ?? null,
    author_bio: post.author_bio ?? null,
    likes_count: parseInt(post.likes_count, 10) || 0,
  };
};

// สร้าง post ใหม่
export const createPost = async (postData, file) => {
  const { title, category_id, description, content, status_id, image, user_id } = postData;

  // ต้องมี file หรือ image URL
  if (!file && !image) {
    throw new Error("Image is required");
  }

  // Business Logic: ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
  if (!title || !category_id || !description || !content || !status_id) {
    throw new Error("Missing required fields");
  }

  // อัพโหลดรูปถ้ามี file ใหม่
  let imageUrl = image;
  if (file) {
    imageUrl = await postRepository.uploadImage(file);
  }

  // เตรียมข้อมูลสำหรับการสร้าง post
  const newPostData = {
    title: title.trim(),
    image: imageUrl,
    category_id,
    description: description.trim(),
    content: content.trim(),
    status_id,
    user_id: user_id || null, // เก็บ user_id ของ admin ที่สร้าง
  };

  // เรียก Repository เพื่อบันทึกข้อมูล
  const post = await postRepository.createPost(newPostData);

  // แจ้งเตือน user ทุกคนว่ามีโพสต์ใหม่ (เฉพาะ published / status_id === 2)
  if (post && post.id && String(status_id) === "2") {
    notificationService.notifyAllUsers({
      actor_id: user_id,
      type: "new_post",
      post_id: post.id,
      post_title: title.trim(),
    }).catch((err) => console.error("Failed to create new_post notifications:", err));
  }

  return post;
};

// อัพเดต post ตาม id
export const updatePost = async (id, postData, file) => {
  const existingPost = await postRepository.getPostById(id);
  if (!existingPost) {
    throw new Error("POST_NOT_FOUND");
  }

  const updateData = {
    title: postData.title?.trim() ?? existingPost.title,
    category_id: postData.category_id ?? existingPost.category_id,
    description: postData.description?.trim() ?? existingPost.description,
    content: postData.content?.trim() ?? existingPost.content,
    status_id: postData.status_id ?? existingPost.status_id,
    image: postData.image ?? existingPost.image, // keep existing image by default
  };

  // ถ้ามีไฟล์ใหม่ ให้อัพโหลดและอัพเดต image URL
  if (file) {
    const newImageUrl = await postRepository.uploadImage(file);
    updateData.image = newImageUrl;
  }

  // อัพเดต post ใน DB
  await postRepository.updatePostById(id, updateData);

  // แจ้งเตือน user ทุกคนว่ามีโพสต์ถูกอัพเดต (เฉพาะ published)
  const finalStatusId = String(updateData.status_id);
  if (finalStatusId === "2") {
    notificationService.notifyAllUsers({
      actor_id: existingPost.user_id,
      type: "post_update",
      post_id: parseInt(id, 10),
      post_title: updateData.title,
    }).catch((err) => console.error("Failed to create post_update notifications:", err));
  }

  return { message: "Updated post successfully" };
};


// ลบ post ตาม id
export const deletePost = async (id) => {
  const existingPost = await postRepository.getPostById(id);

  if (!existingPost) {
    throw new Error("POST_NOT_FOUND");
  }

  // ลบ DB ก่อน
  await postRepository.deletePostById(id);

  // Note: ถ้าต้องการลบไฟล์รูปด้วย ต้องเพิ่ม deleteImage function ใน postRepository

  return { message: "Deleted post successfully" };
};
