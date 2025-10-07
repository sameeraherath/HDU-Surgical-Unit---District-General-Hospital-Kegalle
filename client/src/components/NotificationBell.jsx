import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Divider,
  Button,
  Chip,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Circle,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Info,
  Task,
  MarkEmailRead,
  Delete,
  Archive,
} from "@mui/icons-material";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationAction,
} from "../features/notifications/notificationsSlice";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount, loading } = useSelector(
    (state) => state.notifications
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    dispatch(fetchUnreadCount());
    dispatch(fetchNotifications({ limit: 10 }));

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await dispatch(markNotificationAsRead(notification.id));
    }

    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }

    handleClose();
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllNotificationsAsRead());
  };

  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    await dispatch(deleteNotificationAction(notificationId));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle sx={{ color: "success.main" }} />;
      case "warning":
        return <Warning sx={{ color: "warning.main" }} />;
      case "error":
      case "critical":
        return <ErrorIcon sx={{ color: "error.main" }} />;
      case "task":
        return <Task sx={{ color: "primary.main" }} />;
      default:
        return <Info sx={{ color: "info.main" }} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "error";
      case "high":
        return "warning";
      case "medium":
        return "info";
      case "low":
        return "default";
      default:
        return "default";
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Header */}
        <Box sx={{ p: 2, pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Notifications</Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                startIcon={<MarkEmailRead />}
                onClick={handleMarkAllAsRead}
              >
                Mark all read
              </Button>
            )}
          </Box>
        </Box>

        <Divider />

        {/* Notifications List */}
        {loading && notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">Loading...</Typography>
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <NotificationsIcon
              sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
            />
            <Typography color="text.secondary">No notifications</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0, maxHeight: 350, overflow: "auto" }}>
            {notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  disablePadding
                  sx={{
                    backgroundColor: notification.isRead
                      ? "transparent"
                      : "action.hover",
                  }}
                >
                  <ListItemButton
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <ListItemIcon>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: notification.isRead ? 400 : 600 }}
                          >
                            {notification.title}
                          </Typography>
                          {!notification.isRead && (
                            <Circle
                              sx={{ fontSize: 8, color: "primary.main" }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block" }}
                          >
                            {notification.message.length > 60
                              ? `${notification.message.substring(0, 60)}...`
                              : notification.message}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              mt: 0.5,
                              alignItems: "center",
                            }}
                          >
                            <Chip
                              label={notification.priority}
                              size="small"
                              color={getPriorityColor(notification.priority)}
                              sx={{ height: 20, fontSize: "0.65rem" }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatTimeAgo(notification.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <IconButton
                      size="small"
                      onClick={(e) =>
                        handleDeleteNotification(e, notification.id)
                      }
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1, textAlign: "center" }}>
              <Button
                fullWidth
                size="small"
                onClick={() => {
                  navigate("/notifications");
                  handleClose();
                }}
              >
                View all notifications
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
