import express from "express";
import {
  addCriticalFactors,
  getCriticalFactorsByPatientId,
  updateCriticalFactors,
} from "../controllers/criticalFactorController.js";
import { authenticateJWT as protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Route to add critical factors for a patient
router.post(
  "/patients/:patientId/critical-factors",
  protect,
  authorize(["Nurse", "Medical Officer", "Consultant", "House Officer"]),
  addCriticalFactors
);

// Route to get critical factors for a patient
router.get(
  "/patients/:patientId/critical-factors",
  protect,
  authorize(["Nurse", "Medical Officer", "Consultant", "House Officer"]),
  getCriticalFactorsByPatientId
);

// Route to update critical factors
router.put(
  "/critical-factors/:criticalFactorId",
  protect,
  authorize(["Nurse", "Medical Officer", "Consultant", "House Officer"]),
  updateCriticalFactors
);

export default router;
