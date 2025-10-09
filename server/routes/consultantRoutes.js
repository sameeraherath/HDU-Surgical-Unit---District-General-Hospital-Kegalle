// server/routes/consultantRoutes.js
import express from "express";
import * as consultantController from "../controllers/consultantController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// Dashboard overview stats
router.get("/stats/overview", consultantController.getDashboardStats);

// Patients needing attention
router.get(
  "/stats/patients-needing-attention",
  consultantController.getPatientsNeedingAttention
);

// Recent activity
router.get("/stats/recent-activity", consultantController.getRecentActivity);

// Workload metrics
router.get("/stats/workload", consultantController.getWorkloadMetrics);

// Upcoming discharges
router.get(
  "/stats/upcoming-discharges",
  consultantController.getUpcomingDischarges
);

// Refresh all data
router.get("/stats/refresh", consultantController.refreshAllData);

export default router;
