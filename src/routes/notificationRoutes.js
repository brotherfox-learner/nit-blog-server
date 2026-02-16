import express from "express";
import * as notificationController from "../controllers/notificationController.js";
import { protectUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// ทุก route ต้อง login
router.use(protectUser);

// GET /notifications - ดึง notifications ของ user
router.get("/", notificationController.getNotifications);

// GET /notifications/unread-count - นับจำนวนที่ยังไม่อ่าน
router.get("/unread-count", notificationController.getUnreadCount);

// PATCH /notifications/read-all - mark ทั้งหมดว่าอ่านแล้ว (ต้องอยู่ก่อน /:id)
router.patch("/read-all", notificationController.markAllAsRead);

// PATCH /notifications/:id/read - mark ว่าอ่านแล้ว
router.patch("/:id/read", notificationController.markAsRead);

// DELETE /notifications/:id - ลบ notification
router.delete("/:id", notificationController.deleteNotification);

export default router;
