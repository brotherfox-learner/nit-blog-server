import * as notificationRepository from "../repositories/notificationRepository.js";

/**
 * Service Layer สำหรับ Notification
 * ทำหน้าที่จัดการ Business Logic
 */

// สร้าง notification (เรียกจาก like/comment service)
export const createNotification = async (data) => {
  const { recipient_id, actor_id, type, post_id, comment_id, post_title, comment_text } = data;

  // ไม่สร้าง notification ถ้า actor เป็นคนเดียวกับ recipient (กดไลค์/คอมเมนต์โพสต์ตัวเอง)
  if (recipient_id === actor_id) return null;

  if (!recipient_id || !type) return null;

  const notification = await notificationRepository.create({
    recipient_id,
    actor_id,
    type,
    post_id,
    comment_id,
    post_title,
    comment_text,
  });

  return notification;
};

// สร้าง notification ให้ user ทุกคน (new_post / post_update)
export const notifyAllUsers = async ({ actor_id, type, post_id, post_title }) => {
  if (!actor_id || !type || !post_id) return 0;
  const count = await notificationRepository.createBulkForAllUsers({
    actor_id,
    type,
    post_id,
    post_title,
  });
  return count;
};

// ดึง notifications ของ user
export const getNotifications = async (recipientId, { limit = 20, offset = 0 } = {}) => {
  const notifications = await notificationRepository.findByRecipientId(recipientId, { limit, offset });
  const unreadCount = await notificationRepository.countUnread(recipientId);

  return {
    notifications: notifications.map((n) => ({
      id: n.id,
      type: n.type,
      post_id: n.post_id,
      comment_id: n.comment_id,
      post_title: n.post_title,
      comment_text: n.comment_text,
      is_read: n.is_read,
      read_at: n.read_at,
      created_at: n.created_at,
      actor: {
        id: n.actor_id,
        name: n.actor_name,
        username: n.actor_username,
        avatar: n.actor_avatar,
      },
    })),
    unread_count: unreadCount,
  };
};

// นับจำนวนที่ยังไม่อ่าน
export const getUnreadCount = async (recipientId) => {
  const count = await notificationRepository.countUnread(recipientId);
  return { unread_count: count };
};

// mark as read ทีละอัน
export const markAsRead = async (id, recipientId) => {
  const updated = await notificationRepository.markAsRead(id, recipientId);
  if (!updated) {
    throw new Error("NOTIFICATION_NOT_FOUND");
  }
  return { message: "Notification marked as read" };
};

// mark all as read
export const markAllAsRead = async (recipientId) => {
  const count = await notificationRepository.markAllAsRead(recipientId);
  return { message: `Marked ${count} notifications as read`, count };
};

// ลบ notification
export const deleteNotification = async (id, recipientId) => {
  const deleted = await notificationRepository.deleteById(id, recipientId);
  if (!deleted) {
    throw new Error("NOTIFICATION_NOT_FOUND");
  }
  return { message: "Notification deleted" };
};
