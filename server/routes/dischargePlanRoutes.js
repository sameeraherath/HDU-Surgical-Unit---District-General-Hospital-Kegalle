// server/routes/dischargePlanRoutes.js
import express from "express";
import dischargePlanController from "../controllers/dischargePlanController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// Create discharge plan
router.post("/", dischargePlanController.createDischargePlan);

// Get all discharge plans (with filters)
router.get("/", dischargePlanController.getAllDischargePlans);

// Get pending discharge plans
router.get("/pending", dischargePlanController.getPendingDischargePlans);

// Get discharge statistics
router.get("/stats", dischargePlanController.getDischargeStats);

// Get discharge plan by patient
router.get(
  "/patient/:patientId",
  dischargePlanController.getDischargePlanByPatient
);

// Get single discharge plan
router.get("/:id", dischargePlanController.getDischargePlanById);

// Update discharge plan
router.put("/:id", dischargePlanController.updateDischargePlan);

// Submit for approval
router.post("/:id/submit", dischargePlanController.submitForApproval);

// Approve discharge plan
router.post("/:id/approve", dischargePlanController.approveDischargePlan);

// Complete discharge
router.post("/:id/complete", dischargePlanController.completeDischargePlan);

// Cancel discharge plan
router.post("/:id/cancel", dischargePlanController.cancelDischargePlan);

// Update checklist
router.patch(
  "/:id/checklist",
  dischargePlanController.updateDischargeChecklist
);

export default router;
