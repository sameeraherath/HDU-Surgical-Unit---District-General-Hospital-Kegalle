import express from "express";
import {
  getDashboardOverview,
  getWorkloadStatistics,
  getPatientSummary,
  getMyPatients,
} from "../controllers/medicalOfficerController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// Medical Officer Dashboard routes
router.get("/dashboard", getDashboardOverview);
router.get("/statistics/workload", getWorkloadStatistics);
router.get("/patients", getMyPatients);
router.get("/patients/:patientId/summary", getPatientSummary);

export default router;
