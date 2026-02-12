import * as postRepository from "../repositories/postRepository.js";

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
    title: row.title,
    description: row.description,
    date: row.date,
    content: row.content,
    status: row.status ?? null,
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
    title: post.title,
    description: post.description,
    date: post.date,
    content: post.content,
    status: post.status ?? null,
    likes_count: parseInt(post.likes_count, 10) || 0,
  };
};

// สร้าง post ใหม่
export const createPost = async (postData, file) => {
  const { title, category_id, description, content, status_id } = postData;

  if (!file) {
    throw new Error("Image is required");
  }

  // Business Logic: ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
  if (!title || !category_id || !description || !content || !status_id) {
    throw new Error("Missing required fields");
  }

  // Business Logic: ตรวจสอบว่าชื่อ post มีอยู่แล้วหรือไม่ (ถ้าต้องการ)
  // const existingPost = await postRepository.findByTitle(title);
  // if (existingPost) {
  //   throw new Error("Post with this title already exists");
  // }

  const imageUrl = await storageRepository.uploadImage(file);

  // เตรียมข้อมูลสำหรับการสร้าง post
  const newPostData = {
    title: title.trim(),
    image: imageUrl,
    category_id,
    description: description.trim(),
    content: content.trim(),
    status_id,
  };

  // เรียก Repository เพื่อบันทึกข้อมูล
  const post = await postRepository.createPost(newPostData);

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
  };

  const existingImageUrl = existingPost.image;

  // ✅ ถ้ามีไฟล์ใหม่
  if (file) {
    const newImageUrl = await storageRepository.uploadImage(file);

    try {
      await postRepository.updatePostById(id, {
        ...updateData,
        image: newImageUrl,
      });

      // ลบรูปเก่า หลัง DB สำเร็จ
      if (existingImageUrl) {
        await storageRepository.deleteImage(existingImageUrl);
      }

    } catch (error) {
      // rollback รูปใหม่ถ้า DB fail
      await storageRepository.deleteImage(newImageUrl);
      throw error;
    }

    return { message: "Updated post successfully" };
  }

  // ✅ กรณีไม่มีไฟล์ใหม่
  await postRepository.updatePostById(id, updateData);
  return { message: "Updated post successfully" };
};


// ลบ post ตาม id
export const deletePost = async (id) => {
  const existingPost = await postRepository.getPostById(id);

  if (!existingPost) {
    throw new Error("POST_NOT_FOUND");
  }

  const imageUrl = existingPost.image;

  // ลบ DB ก่อน
  await postRepository.deletePostById(id);

  // ค่อยลบไฟล์ (ถ้ามี)
  if (imageUrl) {
    try {
      await storageRepository.deleteImage(imageUrl);
    } catch (error) {
      // log ไว้ แต่ไม่ throw
      console.error("Failed to delete image:", error);
    }
  }

  return { message: "Deleted post successfully" };
};
