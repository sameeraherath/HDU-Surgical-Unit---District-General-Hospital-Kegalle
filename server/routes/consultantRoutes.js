// server/routes/consultantRoutes.js
const express = require("express");
const router = express.Router();
const consultantController = require("../controllers/consultantController");
const { authenticateJWT } = require("../middleware/auth");

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

module.exports = router;
