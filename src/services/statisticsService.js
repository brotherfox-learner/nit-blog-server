import * as statisticsRepository from "../repositories/statisticsRepository.js";

/**
 * Service Layer สำหรับ Statistics
 */

// บันทึก post view + reading time
export const recordPostView = async ({ post_id, viewer_id, reading_time_seconds }) => {
  if (!post_id) throw new Error("post_id is required");

  const view = await statisticsRepository.createPostView({
    post_id,
    viewer_id,
    reading_time_seconds: reading_time_seconds || 0,
  });

  // อัพเดต last_active ของ viewer
  if (viewer_id) {
    await statisticsRepository.updateLastActive(viewer_id);
  }

  return view;
};

// ดึง stats ตาม role
export const getMyStats = async (userId, role) => {
  // อัพเดต last_active ก่อน
  await statisticsRepository.updateLastActive(userId);

  if (role === "admin") {
    const stats = await statisticsRepository.getAdminStats(userId);
    return {
      role: "admin",
      total_posts: parseInt(stats?.total_posts, 10) || 0,
      total_likes: parseInt(stats?.total_likes, 10) || 0,
      total_comments: parseInt(stats?.total_comments, 10) || 0,
      total_reading_time: parseInt(stats?.total_reading_time, 10) || 0,
      last_active: stats?.last_active || null,
    };
  }

  const stats = await statisticsRepository.getUserStats(userId);
  return {
    role: "user",
    total_comments: parseInt(stats?.total_comments, 10) || 0,
    total_reading_time: parseInt(stats?.total_reading_time, 10) || 0,
    last_active: stats?.last_active || null,
  };
};
