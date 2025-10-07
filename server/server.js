import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/authRoutes.js";
import bedRoutes from "./routes/bedRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import criticalFactorRoutes from "./routes/criticalFactorRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { connectMySql, sequelize } from "./config/mysqlDB.js";
import path from "path";

dotenv.config();
const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.user.id;
    socket.userRole = decoded.user.role;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.userId}`);
  
  // Join user-specific room
  socket.join(`user_${socket.userId}`);
  
  // Join role-specific room
  socket.join(`role_${socket.userRole}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

// Make io available to routes
app.set("io", io);

app.use("/api/auth", authRoutes);
app.use("/api/beds", bedRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/critical-factors", criticalFactorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

httpServer.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Socket.IO server is ready`);
  try {
    await connectMySql();
    console.log("Database is connected and models are synchronized");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
});

export { io };
