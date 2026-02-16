import * as statisticsService from "../services/statisticsService.js";
import pool from "../utils/db.mjs";

/**
 * Controller Layer สำหรับ Statistics
 */

// POST /statistics/post-view - บันทึก post view + reading time
export const recordPostView = async (req, res, next) => {
  try {
    const { post_id, reading_time_seconds } = req.body;
    const viewer_id = req.user?.id || null;

    const view = await statisticsService.recordPostView({
      post_id,
      viewer_id,
      reading_time_seconds,
    });

    res.status(201).json({ message: "View recorded", view });
  } catch (error) {
    if (error.message === "post_id is required") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// GET /statistics/me - ดึง stats ของ user ที่ login
export const getMyStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // ดึง role จาก DB เพราะ protectUser อาจไม่มี role
    const userResult = await pool.query("SELECT role FROM users WHERE id = $1", [userId]);
    const role = userResult.rows[0]?.role || "user";
    const result = await statisticsService.getMyStats(userId, role);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
