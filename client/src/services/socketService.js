import { io } from "socket.io-client";
import { store } from "../store/store";
import { addRealTimeNotification } from "../features/notifications/notificationsSlice";
import { showToast } from "../features/ui/uiSlice";

let socket = null;

export const initializeSocket = (token) => {
  if (socket) {
    socket.disconnect();
  }

  const serverUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  socket = io(serverUrl, {
    auth: {
      token,
    },
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("Socket.IO connected");
  });

  socket.on("disconnect", () => {
    console.log("Socket.IO disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket.IO connection error:", error);
  });

  // Listen for notifications
  socket.on("notification", (notification) => {
    console.log("Received notification:", notification);

    // Add to Redux store
    store.dispatch(addRealTimeNotification(notification));

    // Show toast notification based on priority
    const severity =
      notification.type === "error" || notification.type === "critical"
        ? "error"
        : notification.type === "warning"
        ? "warning"
        : notification.type === "success"
        ? "success"
        : "info";

    store.dispatch(
      showToast({
        message: notification.title,
        severity,
      })
    );

    // Play sound if enabled
    const settings = store.getState().notifications.settings;
    if (settings?.enableSound) {
      playNotificationSound(notification.priority);
    }

    // Show desktop notification if enabled
    if (settings?.enableDesktopNotifications) {
      showDesktopNotification(notification);
    }
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  return socket;
};

// Play notification sound based on priority
const playNotificationSound = (priority) => {
  try {
    const audio = new Audio();

    // Different sounds for different priorities
    switch (priority) {
      case "urgent":
      case "high":
        audio.src = "/sounds/urgent.mp3"; // Add sound files to public/sounds/
        break;
      case "medium":
        audio.src = "/sounds/medium.mp3";
        break;
      case "low":
        audio.src = "/sounds/low.mp3";
        break;
      default:
        audio.src = "/sounds/default.mp3";
    }

    audio.volume = 0.5;
    audio.play().catch((err) => {
      console.error("Error playing notification sound:", err);
    });
  } catch (error) {
    console.error("Error in playNotificationSound:", error);
  }
};

// Show desktop notification
const showDesktopNotification = (notification) => {
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/vite.svg", // Replace with app icon
        badge: "/vite.svg",
        tag: notification.id,
        requireInteraction: notification.priority === "urgent",
      });
    } catch (error) {
      console.error("Error showing desktop notification:", error);
    }
  }
};

// Request desktop notification permission
export const requestNotificationPermission = async () => {
  if ("Notification" in window && Notification.permission === "default") {
    try {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }
  return Notification.permission === "granted";
};
