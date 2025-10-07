import express from "express";
import {
  recordFluidBalance,
  getFluidBalanceByPatient,
  getFluidBalanceSummary,
  getFluidBalanceChartData,
  updateFluidBalance,
  verifyFluidBalance,
  deleteFluidBalance,
} from "../controllers/fluidBalanceController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// Fluid Balance routes
router.post("/", recordFluidBalance);
router.get("/:patientId", getFluidBalanceByPatient);
router.get("/:patientId/summary", getFluidBalanceSummary);
router.get("/:patientId/chart", getFluidBalanceChartData);
router.put("/:id", updateFluidBalance);
router.put("/:id/verify", verifyFluidBalance);
router.delete("/:id", deleteFluidBalance);

export default router;
