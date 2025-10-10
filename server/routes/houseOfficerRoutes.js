import express from "express";
import {
  getDashboardOverview,
  getAssignedTasks,
  updateTaskStatus,
  getPatientDetails,
  getPatientsList,
  getTaskStatistics,
} from "../controllers/houseOfficerController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// House Officer Dashboard routes
router.get("/dashboard", getDashboardOverview);
router.get("/statistics/tasks", getTaskStatistics);

// Task management routes
router.get("/tasks", getAssignedTasks);
router.put("/tasks/:taskId", updateTaskStatus);

// Patient management routes (read-only)
router.get("/patients", getPatientsList);
router.get("/patients/:patientId", getPatientDetails);

export default router;
