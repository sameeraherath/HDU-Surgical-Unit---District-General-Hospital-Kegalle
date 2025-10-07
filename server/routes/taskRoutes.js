import express from "express";
import {
  createTask,
  getMyTasks,
  getTasksByPatient,
  getTasksCreatedByMe,
  updateTaskStatus,
  updateTask,
  cancelTask,
  deleteTask,
  getOverdueTasks,
  getTaskStatistics,
} from "../controllers/taskController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// Task routes
router.post("/", createTask);
router.get("/my-tasks", getMyTasks);
router.get("/created-by-me", getTasksCreatedByMe);
router.get("/overdue", getOverdueTasks);
router.get("/statistics", getTaskStatistics);
router.get("/patient/:patientId", getTasksByPatient);
router.put("/:id/status", updateTaskStatus);
router.put("/:id", updateTask);
router.put("/:id/cancel", cancelTask);
router.delete("/:id", deleteTask);

export default router;
