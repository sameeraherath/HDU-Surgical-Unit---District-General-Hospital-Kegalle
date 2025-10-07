import express from "express";
import {
  getNotifications,
  getUnreadCount,
  createNotification,
  markAsRead,
  markAllAsRead,
  archiveNotification,
  deleteNotification,
  getNotificationSettings,
  updateNotificationSettings,
  cleanupExpiredNotifications,
} from "../controllers/notificationController.js";
import { authenticateJWT, authorize } from "../middleware/auth.js";

const router = express.Router();

// Notification routes
router.get("/", authenticateJWT, getNotifications);
router.get("/unread-count", authenticateJWT, getUnreadCount);
router.post("/", authenticateJWT, createNotification);
router.put("/:id/read", authenticateJWT, markAsRead);
router.put("/read-all", authenticateJWT, markAllAsRead);
router.put("/:id/archive", authenticateJWT, archiveNotification);
router.delete("/:id", authenticateJWT, deleteNotification);

// Notification settings routes
router.get("/settings", authenticateJWT, getNotificationSettings);
router.put("/settings", authenticateJWT, updateNotificationSettings);

// Cleanup route (should be protected for admin only in production)
router.delete("/cleanup", authenticateJWT, cleanupExpiredNotifications);

export default router;
