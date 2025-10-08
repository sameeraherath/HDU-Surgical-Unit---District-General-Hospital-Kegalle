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
import auditRoutes from "./routes/auditRoutes.js";
import progressNoteRoutes from "./routes/progressNoteRoutes.js";
import investigationRoutes from "./routes/investigationRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import fluidBalanceRoutes from "./routes/fluidBalanceRoutes.js";
import medicalOfficerRoutes from "./routes/medicalOfficerRoutes.js";
// Phase 3: Consultant Dashboard routes
import wardRoundRoutes from "./routes/wardRoundRoutes.js";
import dischargePlanRoutes from "./routes/dischargePlanRoutes.js";
import teachingNoteRoutes from "./routes/teachingNoteRoutes.js";
import consultationRoutes from "./routes/consultationRoutes.js";
import clinicalAuditRoutes from "./routes/clinicalAuditRoutes.js";
import consultantRoutes from "./routes/consultantRoutes.js";
import { connectMySql, sequelize } from "./config/mysqlDB.js";
import { auditMiddleware } from "./middleware/auditMiddleware.js";
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

// Apply audit middleware to all routes (must be after authentication routes)
app.use(auditMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/beds", bedRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/critical-factors", criticalFactorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/audit", auditRoutes);

// Phase 2: Medical Officer Dashboard routes
app.use("/api/medical-officer/progress-notes", progressNoteRoutes);
app.use("/api/medical-officer/investigations", investigationRoutes);
app.use("/api/medical-officer/prescriptions", prescriptionRoutes);
app.use("/api/medical-officer/tasks", taskRoutes);
app.use("/api/medical-officer/fluid-balance", fluidBalanceRoutes);
app.use("/api/medical-officer", medicalOfficerRoutes);

// Phase 3: Consultant Dashboard routes
app.use("/api/consultant/ward-rounds", wardRoundRoutes);
app.use("/api/consultant/discharge-plans", dischargePlanRoutes);
app.use("/api/consultant/teaching-notes", teachingNoteRoutes);
app.use("/api/consultant/consultations", consultationRoutes);
app.use("/api/consultant/clinical-audits", clinicalAuditRoutes);
app.use("/api/consultant", consultantRoutes);

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
