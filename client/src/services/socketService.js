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
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("✅ Socket.IO connected");
    
    // Auto-join user and role rooms after connection
    const state = store.getState();
    const user = state.auth?.user;
    
    if (user) {
      joinRooms({
        userId: user.id,
        role: user.role,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("🔌 Socket.IO disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket.IO connection error:", error);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log(`🔄 Socket.IO reconnected after ${attemptNumber} attempts`);
  });

  // Listen for notifications
  socket.on("notification", (notification) => {
    console.log("🔔 Received notification:", notification);

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

  // Listen for real-time task updates
  socket.on("task:created", (task) => {
    console.log("📋 New task created:", task);
    store.dispatch(
      showToast({
        message: `New task assigned: ${task.title}`,
        severity: "info",
      })
    );
  });

  socket.on("task:updated", (task) => {
    console.log("📝 Task updated:", task);
  });

  socket.on("task:statusChanged", (data) => {
    console.log("✅ Task status changed:", data);
    store.dispatch(
      showToast({
        message: `Task "${data.title}" status: ${data.status}`,
        severity: "info",
      })
    );
  });

  // Listen for investigation updates
  socket.on("investigation:ordered", (investigation) => {
    console.log("🔬 Investigation ordered:", investigation);
    store.dispatch(
      showToast({
        message: `New investigation ordered: ${investigation.testName}`,
        severity: "info",
      })
    );
  });

  socket.on("investigation:resultAdded", (result) => {
    console.log("📊 Investigation result added:", result);
    const isAbnormal = result.isAbnormal;
    store.dispatch(
      showToast({
        message: `Investigation result: ${result.testName}${isAbnormal ? " (ABNORMAL)" : ""}`,
        severity: isAbnormal ? "warning" : "success",
      })
    );
    if (isAbnormal) {
      playNotificationSound("urgent");
    }
  });

  socket.on("investigation:critical", (investigation) => {
    console.log("🚨 CRITICAL investigation result:", investigation);
    store.dispatch(
      showToast({
        message: `⚠️ CRITICAL: ${investigation.testName} - ${investigation.result}`,
        severity: "error",
      })
    );
    playNotificationSound("urgent");
    
    // Show desktop notification for critical results
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("🚨 CRITICAL Investigation Result", {
        body: `${investigation.testName}: ${investigation.result}`,
        icon: "/vite.svg",
        requireInteraction: true,
        tag: `critical-${investigation.id}`,
      });
    }
  });

  // Listen for prescription updates
  socket.on("prescription:created", (prescription) => {
    console.log("💊 Prescription created:", prescription);
    store.dispatch(
      showToast({
        message: `New prescription: ${prescription.medicationName}`,
        severity: "info",
      })
    );
  });

  socket.on("prescription:verified", (prescription) => {
    console.log("✅ Prescription verified:", prescription);
    store.dispatch(
      showToast({
        message: `Prescription verified: ${prescription.medicationName}`,
        severity: "success",
      })
    );
  });

  socket.on("prescription:dispensed", (prescription) => {
    console.log("💉 Prescription dispensed:", prescription);
    store.dispatch(
      showToast({
        message: `Medication dispensed: ${prescription.medicationName}`,
        severity: "success",
      })
    );
  });

  // Listen for fluid balance alerts
  socket.on("fluidBalance:abnormal", (data) => {
    console.log("⚠️ Abnormal fluid balance:", data);
    store.dispatch(
      showToast({
        message: `⚠️ Abnormal fluid balance for Patient ${data.patientId}: ${data.balance > 0 ? '+' : ''}${data.balance}mL`,
        severity: "warning",
      })
    );
    playNotificationSound("medium");
  });

  // Listen for progress note updates
  socket.on("progressNote:created", (note) => {
    console.log("📝 Progress note created:", note);
  });

  socket.on("progressNote:reviewed", (note) => {
    console.log("✅ Progress note reviewed:", note);
    store.dispatch(
      showToast({
        message: `Your progress note was reviewed`,
        severity: "info",
      })
    );
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

// Utility to join rooms (user, role, patient)
export const joinRooms = ({ userId, role, patientIds = [] }) => {
  if (!socket || !socket.connected) {
    console.warn("Socket not connected, cannot join rooms");
    return;
  }
  
  if (userId) {
    socket.emit("joinRoom", `user:${userId}`);
    console.log(`🔑 Joined room: user:${userId}`);
  }
  
  if (role) {
    socket.emit("joinRoom", `role:${role}`);
    console.log(`👥 Joined room: role:${role}`);
  }
  
  if (Array.isArray(patientIds) && patientIds.length > 0) {
    patientIds.forEach((pid) => {
      socket.emit("joinRoom", `patient:${pid}`);
      console.log(`🏥 Joined room: patient:${pid}`);
    });
  }
};

// Utility to leave rooms
export const leaveRooms = ({ userId, role, patientIds = [] }) => {
  if (!socket || !socket.connected) {
    console.warn("Socket not connected, cannot leave rooms");
    return;
  }
  
  if (userId) {
    socket.emit("leaveRoom", `user:${userId}`);
    console.log(`🔓 Left room: user:${userId}`);
  }
  
  if (role) {
    socket.emit("leaveRoom", `role:${role}`);
    console.log(`👋 Left room: role:${role}`);
  }
  
  if (Array.isArray(patientIds) && patientIds.length > 0) {
    patientIds.forEach((pid) => {
      socket.emit("leaveRoom", `patient:${pid}`);
      console.log(`🏥 Left room: patient:${pid}`);
    });
  }
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
