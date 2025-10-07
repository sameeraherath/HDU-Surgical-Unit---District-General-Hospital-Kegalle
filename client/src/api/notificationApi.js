import apiClient from "./apiClient";

// Get notifications
export const getNotifications = async (params = {}) => {
  const response = await apiClient.get("/notifications", { params });
  return response.data;
};

// Get unread count
export const getUnreadCount = async () => {
  const response = await apiClient.get("/notifications/unread-count");
  return response.data;
};

// Create notification
export const createNotification = async (notificationData) => {
  const response = await apiClient.post("/notifications", notificationData);
  return response.data;
};

// Mark as read
export const markAsRead = async (id) => {
  const response = await apiClient.put(`/notifications/${id}/read`);
  return response.data;
};

// Mark all as read
export const markAllAsRead = async () => {
  const response = await apiClient.put("/notifications/read-all");
  return response.data;
};

// Archive notification
export const archiveNotification = async (id) => {
  const response = await apiClient.put(`/notifications/${id}/archive`);
  return response.data;
};

// Delete notification
export const deleteNotification = async (id) => {
  const response = await apiClient.delete(`/notifications/${id}`);
  return response.data;
};

// Get notification settings
export const getNotificationSettings = async () => {
  const response = await apiClient.get("/notifications/settings");
  return response.data;
};

// Update notification settings
export const updateNotificationSettings = async (settings) => {
  const response = await apiClient.put("/notifications/settings", settings);
  return response.data;
};
