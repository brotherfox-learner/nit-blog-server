import * as likeRepository from "../repositories/likeRepository.js";
import * as postRepository from "../repositories/postRepository.js";
import * as notificationService from "./notificationService.js";
import * as statisticsRepository from "../repositories/statisticsRepository.js";

/**
 * Service Layer สำหรับ Like
 */

export const likePost = async (post_id, user_id) => {
  if (!post_id || !user_id) {
    throw new Error("user_id is required");
  }
  const post = await postRepository.getPostById(post_id);
  if (!post) {
    throw new Error("POST_NOT_FOUND");
  }
  const existing = await likeRepository.findByPostAndUser(post_id, user_id);
  if (existing) {
    throw new Error("ALREADY_LIKED");
  }
  const like = await likeRepository.create({ post_id, user_id });

  // อัพเดต last_active
  statisticsRepository.updateLastActive(user_id).catch(() => {});

  // สร้าง notification ให้เจ้าของโพสต์
  if (post.user_id) {
    notificationService.createNotification({
      recipient_id: post.user_id,
      actor_id: user_id,
      type: "like",
      post_id: parseInt(post_id, 10),
      post_title: post.title,
    }).catch((err) => console.error("Failed to create like notification:", err));
  }

  return { message: "Post liked successfully", like };
};

export const unlikePost = async (post_id, user_id) => {
  if (!post_id || !user_id) {
    throw new Error("user_id is required");
  }
  const existing = await likeRepository.findByPostAndUser(post_id, user_id);
  if (!existing) {
    throw new Error("LIKE_NOT_FOUND");
  }
  await likeRepository.deleteByPostAndUser(post_id, user_id);
  return { message: "Post unliked successfully" };
};

export const getLikesByPostId = async (post_id) => {
  const post = await postRepository.findById(post_id);
  if (!post) {
    throw new Error("POST_NOT_FOUND");
  }
  const likes = await likeRepository.findByPostId(post_id);
  const count = await likeRepository.countByPostId(post_id);
  return {
    post_id: parseInt(post_id, 10),
    like_count: count,
    likes: likes.map((row) => ({
      id: row.id,
      post_id: row.post_id,
      user_id: row.user_id,
      username: row.username,
      liked_at: row.liked_at,
    })),
  };
};

export const checkUserLiked = async (post_id, user_id) => {
  const like = await likeRepository.findByPostAndUser(post_id, user_id);
  return { liked: !!like };
};
