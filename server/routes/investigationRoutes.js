import express from "express";
import {
  orderInvestigation,
  getInvestigationsByPatient,
  getPendingInvestigations,
  updateInvestigationStatus,
  cancelInvestigation,
  addInvestigationResult,
  getInvestigationResults,
  reviewInvestigation,
  getCriticalInvestigations,
} from "../controllers/investigationController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// Investigation routes
router.post("/", orderInvestigation);
router.get("/pending", getPendingInvestigations);
router.get("/critical", getCriticalInvestigations);
router.get("/:patientId", getInvestigationsByPatient);
router.put("/:id/status", updateInvestigationStatus);
router.put("/:id/cancel", cancelInvestigation);
router.post("/:id/results", addInvestigationResult);
router.get("/:id/results", getInvestigationResults);
router.put("/:id/review", reviewInvestigation);

export default router;
