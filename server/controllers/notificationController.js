import {
  Notification,
  NotificationSettings,
  UserMySQLModel,
} from "../config/mysqlDB.js";
import { Op } from "sequelize";

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      page = 1,
      limit = 20,
      isRead,
      category,
      type,
      priority,
      isArchived = false,
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const where = { userId, isArchived };

    if (isRead !== undefined) {
      where.isRead = isRead === "true";
    }

    if (category) {
      where.category = category;
    }

    if (type) {
      where.type = type;
    }

    if (priority) {
      where.priority = priority;
    }

    // Get notifications with pagination
    const { count, rows: notifications } = await Notification.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        ["priority", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    // Get unread count
    const unreadCount = await Notification.count({
      where: { userId, isRead: false, isArchived: false },
    });

    res.json({
      notifications,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Notification.count({
      where: { userId, isRead: false, isArchived: false },
    });

    res.json({ count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private (Admin or System)
export const createNotification = async (req, res) => {
  try {
    const {
      userId,
      type,
      title,
      message,
      category,
      priority,
      actionUrl,
      actionType,
      metadata,
      expiresAt,
    } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({
        message: "userId, title, and message are required",
      });
    }

    const notification = await Notification.create({
      userId,
      type: type || "info",
      title,
      message,
      category: category || "general",
      priority: priority || "medium",
      actionUrl,
      actionType,
      metadata,
      expiresAt,
    });

    // Emit socket event for real-time notification
    const io = req.app.get("io");
    if (io) {
      io.to(`user_${userId}`).emit("notification", notification);
    }

    res.status(201).json({
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: { id, userId },
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.update({
      isRead: true,
      readAt: new Date(),
    });

    res.json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.update(
      { isRead: true, readAt: new Date() },
      { where: { userId, isRead: false } }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all as read:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Archive notification
// @route   PUT /api/notifications/:id/archive
// @access  Private
export const archiveNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: { id, userId },
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.update({ isArchived: true });

    res.json({
      message: "Notification archived",
      notification,
    });
  } catch (error) {
    console.error("Error archiving notification:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: { id, userId },
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.destroy();

    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get notification settings
// @route   GET /api/notifications/settings
// @access  Private
export const getNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    let [settings] = await NotificationSettings.findOrCreate({
      where: { userId },
      defaults: { userId },
    });

    res.json({ settings });
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update notification settings
// @route   PUT /api/notifications/settings
// @access  Private
export const updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const settingsData = req.body;

    let [settings] = await NotificationSettings.findOrCreate({
      where: { userId },
      defaults: { userId },
    });

    await settings.update(settingsData);

    res.json({
      message: "Notification settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Error updating notification settings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Clean up expired notifications
// @route   DELETE /api/notifications/cleanup
// @access  Private (Cron job or Admin)
export const cleanupExpiredNotifications = async (req, res) => {
  try {
    const now = new Date();

    const deletedCount = await Notification.destroy({
      where: {
        expiresAt: {
          [Op.lt]: now,
        },
      },
    });

    res.json({
      message: "Expired notifications cleaned up",
      deletedCount,
    });
  } catch (error) {
    console.error("Error cleaning up notifications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
