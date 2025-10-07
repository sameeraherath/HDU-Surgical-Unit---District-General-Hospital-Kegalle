import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
} from "../../api/notificationApi";

const initialState = {
  notifications: [],
  unreadCount: 0,
  settings: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  },
  filters: {
    isRead: undefined,
    category: undefined,
    type: undefined,
    priority: undefined,
  },
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (params, { rejectWithValue }) => {
    try {
      const data = await getNotifications(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUnreadCount();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch unread count"
      );
    }
  }
);

export const addNotification = createAsyncThunk(
  "notifications/addNotification",
  async (notificationData, { rejectWithValue }) => {
    try {
      const data = await createNotification(notificationData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create notification"
      );
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, { rejectWithValue }) => {
    try {
      const data = await markAsRead(id);
      return { id, ...data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark as read"
      );
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const data = await markAllAsRead();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark all as read"
      );
    }
  }
);

export const archiveNotificationAction = createAsyncThunk(
  "notifications/archive",
  async (id, { rejectWithValue }) => {
    try {
      const data = await archiveNotification(id);
      return { id, ...data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to archive notification"
      );
    }
  }
);

export const deleteNotificationAction = createAsyncThunk(
  "notifications/delete",
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteNotification(id);
      return { id, ...data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete notification"
      );
    }
  }
);

export const fetchNotificationSettings = createAsyncThunk(
  "notifications/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getNotificationSettings();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch settings"
      );
    }
  }
);

export const updateSettings = createAsyncThunk(
  "notifications/updateSettings",
  async (settings, { rejectWithValue }) => {
    try {
      const data = await updateNotificationSettings(settings);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update settings"
      );
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addRealTimeNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    updateNotificationInState: (state, action) => {
      const index = state.notifications.findIndex(
        (n) => n.id === action.payload.id
      );
      if (index !== -1) {
        state.notifications[index] = action.payload;
      }
    },
    removeNotificationFromState: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.pagination = action.payload.pagination;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.count;
      })
      // Add notification
      .addCase(addNotification.fulfilled, (state, action) => {
        state.notifications.unshift(action.payload.notification);
      })
      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (n) => n.id === action.payload.id
        );
        if (notification) {
          notification.isRead = true;
          notification.readAt = new Date().toISOString();
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // Mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.isRead = true;
          n.readAt = new Date().toISOString();
        });
        state.unreadCount = 0;
      })
      // Archive
      .addCase(archiveNotificationAction.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (n) => n.id !== action.payload.id
        );
      })
      // Delete
      .addCase(deleteNotificationAction.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (n) => n.id !== action.payload.id
        );
      })
      // Fetch settings
      .addCase(fetchNotificationSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotificationSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload.settings;
      })
      // Update settings
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.settings = action.payload.settings;
      });
  },
});

export const {
  addRealTimeNotification,
  updateNotificationInState,
  removeNotificationFromState,
  setFilters,
  clearError,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
