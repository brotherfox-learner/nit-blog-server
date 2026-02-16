import express from "express";
import * as statisticsController from "../controllers/statisticsController.js";
import { protectUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /statistics/post-view - บันทึก view (optional auth - guest ก็ได้)
router.post("/post-view", (req, res, next) => {
  // Optional auth: ถ้ามี token ก็ดึง user, ถ้าไม่มีก็ให้ผ่าน
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    return protectUser(req, res, next);
  }
  req.user = null;
  next();
}, statisticsController.recordPostView);

// GET /statistics/me - ดึง stats ของ user (ต้อง login)
router.get("/me", protectUser, statisticsController.getMyStats);

export default router;
