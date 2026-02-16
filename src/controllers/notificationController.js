import * as notificationService from "../services/notificationService.js";

/**
 * Controller Layer สำหรับ Notification
 */

// GET /notifications - ดึง notifications ของ user ที่ login
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const result = await notificationService.getNotifications(userId, { limit, offset });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// GET /notifications/unread-count - นับจำนวนที่ยังไม่อ่าน
export const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await notificationService.getUnreadCount(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// PATCH /notifications/:id/read - mark ว่าอ่านแล้ว
export const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const result = await notificationService.markAsRead(id, userId);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "NOTIFICATION_NOT_FOUND") {
      return res.status(404).json({ message: "Notification not found" });
    }
    next(error);
  }
};

// PATCH /notifications/read-all - mark ทั้งหมดว่าอ่านแล้ว
export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await notificationService.markAllAsRead(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// DELETE /notifications/:id - ลบ notification
export const deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const result = await notificationService.deleteNotification(id, userId);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "NOTIFICATION_NOT_FOUND") {
      return res.status(404).json({ message: "Notification not found" });
    }
    next(error);
  }
};
